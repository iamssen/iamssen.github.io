import * as service from '../app/service/service';

const BEHANCE_KEY:string = 'fxmJl9VuZyCaKpSWtA7Xnbholqy6SHR0';

export class BehanceService implements service.BehanceService {
  projects():Promise<any> {
    return new Promise((resolve, reject) => {
      $.getJSON(`https://api.behance.net/v2/users/ssen/projects?client_id=${BEHANCE_KEY}`)
          .then((data) => {
            console.log('ok', data)
          })
          .fail((data) => {
            console.log('err', data)
          })
    });
  }
}