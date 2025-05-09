export class StreamingClient {

	socket;
	transport;
	streamFactory;
	router;
	consumer;
	currentCamera;

	constructor({socket, streamFactory, router}) {
		this.socket = socket;
		this.streamFactory = streamFactory;
		this.router = router;
	}

	start() {
		this.socket.on('disconnect', this.onDisconnected.bind(this));
		this.socket.on('getRtpCapabilities', this.getRtpCapabilities.bind(this));
		this.socket.on('transport-recv-connect', this.connect.bind(this));
		this.socket.on('consume', this.consume.bind(this));
		this.socket.on('consumer-resume', this.resume.bind(this));
		this.socket.on('createWebRtcTransport', this.createWebRtcTransport.bind(this));
		this.socket.emit('connection-success', {
			socketId: this.socket.id
		})

	}
	async stop() {
		await this.stopProducer();
		await this.stopTransport();
	}
	async stopTransport() {
		try {
			if (this.transport) {
				await this.transport.close();
				this.transport = null;
			}
			console.log(`Transport ${this.socket.id} stopped.`);
		}
		catch (e){
			console.error(`Error stopping Transport ${this.socket.id}:`, e);
		}
	}
	async stopProducer() {
		try {
			if (this.producer) {
				await this.producer.close();
				this.producer = null;
			}
			console.log(`Producer ${this.socket.id} stopped.`);
		}
		catch (e){
			console.error(`Error stopping Producer ${this.socket.id}:`, e);
		}
	}

	async onDisconnected() {
		// do some cleanup
		console.log('peer disconnected')
		try {
			await this.currentCamera?.stopRecording({peerId: this.socket.id});
			await this.consumer?.close();
			await this.transport?.close();
		}
		catch (e) {

		}
	}

	getRtpCapabilities(callback) {
		const rtpCapabilities = this.router.rtpCapabilities
		callback({rtpCapabilities})
	}

	async createWebRtcTransport({sender}, callback) {
		try {
			// https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
			const webRtcTransport_options = {
				listenIps: [{
					ip: '0.0.0.0',
					announcedIp: '127.0.0.1',
				}], enableUdp: true, enableTcp: true, preferUdp: true,
			}

			this.transport = await this.router.createWebRtcTransport(webRtcTransport_options)
			console.log(`transport id: ${this.transport.id}`)

			this.transport.on('dtlsstatechange', dtlsState => {
				if (dtlsState === 'closed') {
					this.transport.close()
				}
			})

			this.transport.on('close', () => {
				console.log('transport closed')
			})

			// send back to the client the following prameters
			callback({
				// https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
				params: {
					id: this.transport.id,
					iceParameters: this.transport.iceParameters,
					iceCandidates: this.transport.iceCandidates,
					dtlsParameters: this.transport.dtlsParameters,
				}
			})
		} catch (error) {
			console.log(error)
			callback({
				params: {
					error: error
				}
			})
		}
	}

	async connect({ dtlsParameters }){
		await this.transport.connect({ dtlsParameters });
	}
	async consume({ rtpCapabilities, cameraId, record = false }, callback){
		try {
			const camera = await this.streamFactory(cameraId)
			if (!camera.canConsume({
				rtpCapabilities
			})) {
				console.error("❌ Client does not support stream");
				console.log(JSON.stringify(rtpCapabilities, null, 2))
				callback({ error: "Cannot consume stream" });
				return;
			}

			this.currentCamera = camera;
			// Create Consumer for the client
			this.consumer = await this.transport.consume({
				producerId: camera.producer.id,
				rtpCapabilities,
				paused: false,
			});
			this.currentCamera.record({peerId: this.socket.id});

			await this.consumer.resume();
			this.consumer.on('transportclose', () => {
				console.log("Consumer Transport closed");
			});

			this.consumer.on('producerclose', () => {
				console.log("FFmpeg Producer closed");
				this.consumer.close();
			});

			// Send Consumer parameters to the client
			callback({
				params: {
					id: this.consumer.id,
					producerId: camera.producer.id,
					kind: this.consumer.kind,
					rtpParameters: this.consumer.rtpParameters,
				}
			});

		} catch (error) {
			console.error(error.message);
			callback({ error: error.message });
		}

	}

	async resume(){
		await this.consumer.resume()
	}
}