import asyncio
import json
import sys
import gi

gi.require_version('Gst', '1.0')
gi.require_version('GstSdp', '1.0')
gi.require_version('GstWebRTC', '1.0')

from gi.repository import Gst, GObject, GLib, GstSdp, GstWebRTC

GObject.threads_init()
Gst.init(None)

def create_pipeline():
    pipeline = Gst.Pipeline.new("pipeline")

    videotestsrc = Gst.ElementFactory.make("videotestsrc", "videotestsrc")
    x264enc = Gst.ElementFactory.make("x264enc", "x264enc")
    capsfilter_enc = Gst.ElementFactory.make("capsfilter", "capsfilter_enc")
    rtph264pay = Gst.ElementFactory.make("rtph264pay", "rtph264pay")
    capsfilter_rtp = Gst.ElementFactory.make("capsfilter", "capsfilter_rtp")
    webrtcbin = Gst.ElementFactory.make("webrtcbin", "sendrecv")

    if not all([pipeline, videotestsrc, x264enc, capsfilter_enc, rtph264pay, capsfilter_rtp, webrtcbin]):
        print("Failed to create elements")
        return None

    # Set element properties
    videotestsrc.set_property("is-live", True)
    x264enc.set_property("tune", "zerolatency")
    x264enc.set_property("bitrate", 512)
    x264enc.set_property("speed-preset", "ultrafast")
    rtph264pay.set_property("config-interval", 1)
    rtph264pay.set_property("pt", 96)

    # Set caps
    caps_enc = Gst.Caps.from_string("video/x-h264,stream-format=byte-stream,alignment=au")
    capsfilter_enc.set_property("caps", caps_enc)

    caps_rtp = Gst.Caps.from_string("application/x-rtp,media=video,encoding-name=H264,payload=96,clock-rate=90000")
    capsfilter_rtp.set_property("caps", caps_rtp)

    # Add elements to pipeline
    pipeline.add(videotestsrc)
    pipeline.add(x264enc)
    pipeline.add(capsfilter_enc)
    pipeline.add(rtph264pay)
    pipeline.add(capsfilter_rtp)
    pipeline.add(webrtcbin)

    # Link elements
    if not Gst.Element.link_many(videotestsrc, x264enc, capsfilter_enc, rtph264pay, capsfilter_rtp):
        print("Failed to link encoding elements")
        return None

    # Link capsfilter_rtp to webrtcbin via pads
    srcpad = capsfilter_rtp.get_static_pad("src")
    sinkpad = webrtcbin.get_request_pad("sink_0")

    if not srcpad or not sinkpad:
        print("Failed to get pads for linking capsfilter_rtp to webrtcbin")
        return None

    if srcpad.link(sinkpad) != Gst.PadLinkReturn.OK:
        print("Failed to link capsfilter_rtp to webrtcbin")
        return None

    return pipeline

async def stdin_listener():
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await asyncio.get_event_loop().connect_read_pipe(lambda: protocol, sys.stdin)

    while True:
        line = await reader.readline()
        if not line:
            break

        try:
            msg = json.loads(line.decode())
            if msg['type'] == 'sdp-offer':
                print("Received SDP offer")
                await handle_offer(msg['sdp'])
        except Exception as e:
            print(f"Failed to handle message: {e}")

async def handle_offer(sdp_offer):
    offer = GstSdp.SDPMessage.new()
    res, sdpmsg = GstSdp.sdp_message_new_from_text(sdp_offer)
    if res != GstSdp.SDPResult.OK:
        print("Error parsing SDP offer")
        return

    webrtcbin = pipeline.get_by_name("sendrecv")
    webrtc_offer = GstWebRTC.WebRTCSessionDescription.new(GstWebRTC.WebRTCSDPType.OFFER, sdpmsg)

    def on_set_remote_description(webrtcbin, promise, user_data):
        promise = Gst.Promise.new_with_change_func(on_create_answer, webrtcbin, None)
        webrtcbin.emit('create-answer', None, promise)

    promise = Gst.Promise.new_with_change_func(on_set_remote_description, None, None)
    webrtcbin.emit('set-remote-description', webrtc_offer, promise)

def on_create_answer(promise, webrtcbin, _):
    reply = promise.get_reply()
    answer = reply.get_value('answer')
    if not answer:
        print("Failed to create answer")
        return

    promise2 = Gst.Promise.new()
    webrtcbin.emit('set-local-description', answer, promise2)

    text = answer.sdp.as_text()
    response = json.dumps({"type": "sdp-answer", "sdp": text})
    print(response)
    sys.stdout.flush()

async def main():
    global pipeline
    pipeline = create_pipeline()
    if not pipeline:
        print("Pipeline creation failed")
        return

    pipeline.set_state(Gst.State.PAUSED)
    print("Pipeline set to PAUSED")
    pipeline.set_state(Gst.State.PLAYING)
    print("Pipeline set to PLAYING")

    await stdin_listener()

if __name__ == '__main__':
    asyncio.run(main())