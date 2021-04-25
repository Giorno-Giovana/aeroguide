// TODO такой же может быть и у менеджера категорий
export class FeedManager {
  intervalHandler = () => {
    // TODO тут нужно добавить код, который будет генерировать контент ленты
    const orgs = [
      {
        img: '/kartoshka.png',
        title: 'Крошка картошка',
        moveTime: '25 мин',
        remainingTime: '21 минута на посещение',
      },
      {
        img: '/registration.jpg',
        title: 'Стойка регистрации',
        moveTime: '3 мин',
        remainingTime: '43 минуты на посещение',
      },
      {
        img: '/megafon.jpeg',
        title: 'Мегафон',
        moveTime: '5 мин',
        remainingTime: '41 минута на посещение',
      },
      {
        img: '/bk.png',
        title: 'Burger King',
        moveTime: '2 мин',
        remainingTime: '44 минуты на посещение',
      },
      {
        img: '/mcd.jpg',
        title: 'Макдональдс',
        moveTime: '5 мин',
        remainingTime: '41 минута на посещение',
      },
      {
        img: '/tele2.jpg',
        title: 'Tele2',
        moveTime: '0 мин',
        remainingTime: '46 минут на посещение',
      },
    ]
    if (this.cb) {
      this.cb(orgs)
    }
  }

  subscribe(cb) {
    this.cb = cb
    // TODO тут надо поставить таймер в минуту
    this.intervalHandler()
    // const timeout = 1000 // * 60
    // this.timerId = setInterval(this.intervalHandler, timeout)
  }

  unSubscribe() {
    clearInterval(this.timerId)
  }
}
