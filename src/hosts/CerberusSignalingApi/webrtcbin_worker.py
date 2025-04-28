import asyncio
import json
import sys
import gi

gi.require_version('Gst', '1.0')
gi.require_version('GstSdp', '1.0')
gi.require_version('GstWebRTC', '1.0')

from gi.repository import Gst, GstSdp, GstWebRTC, GObject, GLib

Gst.init(None)
GObject.threads_init()

pipeline = None
webrtcbin = None

def create_pipeline():
    global webrtcbin

    pipeline = Gst.Pipeline.new("pipeline")

    videotestsrc = Gst.ElementFactory.make("videotestsrc", "videotestsrc")
    x264enc = Gst.ElementFactory.make("x264enc", "x264enc")
    rtph264pay = Gst.ElementFactory.make("rtph264pay", "rtph264pay")
    capsfilter_rtp = Gst.ElementFactory.make("capsfilter", "capsfilter_rtp")
    webrtcbin = Gst.ElementFactory.make("webrtcbin", "webrtcbin")

    if not all([pipeline, videotestsrc, x264enc, rtph264pay, capsfilter_rtp, webrtcbin]):
        print("Failed to create some elements")
        return None

    # Set properties
    videotestsrc.set_property("is-live", True)
    x264enc.set_property("tune", "zerolatency")
    x264enc.set_property("bitrate", 512)
    x264enc.set_property("speed-preset", "ultrafast")
    x264enc.set_property("byte-stream", True)  # Key setting!

    rtph264pay.set_property("config-interval", 1)
    rtph264pay.set_property("pt", 96)

    caps = Gst.Caps.from_string(
        "application/x-rtp,media=video,encoding-name=H264,payload=96,clock-rate=90000"
    )
    capsfilter_rtp.set_property("caps", caps)

    # Add elements to pipeline
    pipeline.add(videotestsrc)
    pipeline.add(x264enc)
    pipeline.add(rtph264pay)
    pipeline.add(capsfilter_rtp)
    pipeline.add(webrtcbin)

    if not Gst.Element.link_many(videotestsrc, x264enc, rtph264pay, capsfilter_rtp):
        print("Failed to link encoding elements")
        return None

    # Manually link capsfilter_rtp to webrtcbin sink pad
    sinkpad = webrtcbin.get_request_pad("sink_0")
    srcpad = capsfilter_rtp.get_static_pad("src")
    if not sinkpad or not srcpad:
        print("Failed to get pads for linking")
        return None
    if srcpad.link(sinkpad) != Gst.PadLinkReturn.OK:
        print("Failed to link capsfilter_rtp to webrtcbin")
        return None

    return pipeline

def on_negotiation_needed(webrtcbin):
    promise = Gst.Promise.new_with_change_func(on_offer_created, webrtcbin, None)
    webrtcbin.emit("create-offer", None, promise)

def on_offer_created(promise, webrtcbin, _):
    promise.wait()
    reply = promise.get_reply()
    offer = reply.get_value("offer")

    webrtcbin.emit("set-local-description", offer, None)

    text = offer.sdp.as_text()
    message = {"type": "sdp-answer", "sdp": text}
    print(json.dumps(message))
    sys.stdout.flush()

async def stdin_listener():
    loop = asyncio.get_event_loop()
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await loop.connect_read_pipe(lambda: protocol, sys.stdin)

    while True:
        line = await reader.readline()
        if not line:
            break
        msg = json.loads(line.decode("utf-8"))
        if msg["type"] == "sdp-offer":
            handle_sdp_offer(msg["sdp"])

def handle_sdp_offer(sdp_offer):
    res, sdpmsg = GstSdp.SDPMessage.new()
    GstSdp.sdp_message_parse_buffer(bytes(sdp_offer.encode()), sdpmsg)

    offer = GstWebRTC.WebRTCSessionDescription.new(
        GstWebRTC.WebRTCSDPType.OFFER, sdpmsg
    )

    promise = Gst.Promise.new()
    webrtcbin.emit("set-remote-description", offer, promise)

async def main():
    global pipeline
    pipeline = create_pipeline()
    if not pipeline:
        print("Pipeline creation failed")
        return

    webrtcbin.connect("on-negotiation-needed", on_negotiation_needed)

    pipeline.set_state(Gst.State.PLAYING)

    await stdin_listener()

if __name__ == "__main__":
    asyncio.run(main())
