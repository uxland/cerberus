import {portNumbers} from "get-port";

class PortPool {
	constructor(start = 5000, end = 6000) {
		this.availablePorts = new Set(portNumbers(start, end));
		this.allocatedPorts = new Set();
	}

	allocatePort() {
		if (this.availablePorts.size === 0) {
			throw new Error("No available ports in the pool.");
		}
		const port = this.availablePorts.values().next().value;
		this.availablePorts.delete(port);
		this.allocatedPorts.add(port);
		return port;
	}

	releasePort(port) {
		if (this.allocatedPorts.has(port)) {
			this.allocatedPorts.delete(port);
			this.availablePorts.add(port);
		} else {
			throw new Error(`Port ${port} is not allocated.`);
		}
	}
}
const portPool = new PortPool(5000, 6000);
export default portPool;