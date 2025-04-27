declare module 'paho-mqtt' {
  export class Client {
    constructor(host: string, clientId: string);
    connect(options: {
      onSuccess: () => void;
      onFailure: (error: { errorMessage: string; errorCode: number }) => void;
      userName?: string;
      password?: string;
      keepAliveInterval?: number;
      useSSL?: boolean;
    }): void;
    subscribe(topic: string, options?: { qos: number }): void;
    disconnect(): void;
    isConnected(): boolean;
    onConnectionLost: (responseObject: { errorCode: number; errorMessage: string }) => void;
    onMessageArrived: (message: { payloadString: string }) => void;
  }
}