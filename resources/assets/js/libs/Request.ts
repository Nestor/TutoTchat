import 'whatwg-fetch'

export class Request {

  private static options: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as Element).getAttribute('content') as string,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  static async get (url: string) {
    let response = await fetch(url, this.options)
    if (response.ok) {
      return response.json()
    } else {
      let error: {message: string} = await response.json()
      throw new Error(error.message)
    }
  }

  public static async post (url: string, params: object = {}) {
    let csrf = (document.querySelector('meta[name=csrf-token]') as HTMLElement).getAttribute('content')
    let options = {...this.options,
      method: 'POST',
      body: JSON.stringify({...params, authenticity_token: csrf})
    }
    let response = await fetch(url, options)
    if (response.status === 200) {
      return response.json()
    } else {
      let json = await response.json()
      throw json
    }
  }

}
