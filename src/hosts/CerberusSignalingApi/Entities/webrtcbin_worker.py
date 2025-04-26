import sys
import json
import gi
import urllib.parse

gi.require_version('Gst', '1.0')
gi.require_version('GstWebRTC', '1.0')
gi.require_version('GstSdp', '1.0')
from gi.repository import Gst, GObject, GstWebRTC, GstSdp

Gst.init(None)

# Read arguments from the process call
stream_type = sys.argv[1]  # 'rtsp' or 'file'
codec = sys.argv[2]        # 'h264' or 'h265'
source_url = urllib.parse.unquote(sys.argv[3])  # URL encoded

# Build the pipeline dynamically
if stream_type == "Rtsp" and codec == "H264":
    pipeline_str = f"rtspsrc location={source_url} latency=0 ! rtph264depay ! rtph264pay ! application/x-rtp,media=video,encoding-name=H264,payload=96 ! webrtcbin name=sendrecv"

elif stream_type == "Rtsp" and codec == "H265":
    pipeline_str = f"rtspsrc location={source_url} latency=0 ! rtph265depay ! h265parse ! avdec_h265 ! x264enc tune=zerolatency ! rtph264pay ! application/x-rtp,media=video,encoding-name=H264,payload=96 ! webrtcbin name=sendrecv"

elif stream_type == "File":
    pipeline_str = f"filesrc location={source_url} ! decodebin ! x264enc tune=zerolatency ! rtph264pay ! application/x-rtp,media=video,encoding-name=H264,payload=96 ! webrtcbin name=sendrecv"

else:
    raise Exception(f"Unsupported input combination: {stream_type} / {codec}")

pipeline = Gst.parse_launch(pipeline_str)