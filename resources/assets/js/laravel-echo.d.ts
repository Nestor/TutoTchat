declare module 'laravel-echo' {

  export default class laravel_echo {
    constructor(options: any);

    channel(_channel: any): any;

    disconnect(): void;

    join(channel: any): any;

    leave(channel: any): void;

    listen(channel: any, event: any, callback: any): any;

    private(channel: any): any;

    registerAxiosRequestInterceptor(): any;

    registerVueRequestInterceptor(): void;

    registerjQueryAjaxSetup(): void;

    socketId(): any;

  }

  declare namespace laravel_echo {
    namespace prototype {
      function channel(_channel: any): any;

      function disconnect(): void;

      function join(channel: any): any;

      function leave(channel: any): void;

      function listen(channel: any, event: any, callback: any): any;

      function registerAxiosRequestInterceptor(): any;

      function registerVueRequestInterceptor(): void;

      function registerjQueryAjaxSetup(): void;

      function socketId(): any;

      namespace channel {
        const prototype: {
        };

      }

      namespace disconnect {
        const prototype: {
        };

      }

      namespace join {
        const prototype: {
        };

      }

      namespace leave {
        const prototype: {
        };

      }

      namespace listen {
        const prototype: {
        };

      }

      namespace registerAxiosRequestInterceptor {
        const prototype: {
        };

      }

      namespace registerVueRequestInterceptor {
        const prototype: {
        };

      }

      namespace registerjQueryAjaxSetup {
        const prototype: {
        };

      }

      namespace socketId {
        const prototype: {
        };

      }

    }

  }


}
