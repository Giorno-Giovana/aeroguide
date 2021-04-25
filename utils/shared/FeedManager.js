// TODO такой же может быть и у менеджера категорий
export class FeedManager {
  intervalHandler = () => {
    // TODO тут нужно добавить код, который будет генерировать контент ленты
    const orgs = [
      {
        img: '/bk.png',
        title: 'Burger King',
        moveTime: '2 мин',
        remainingTime: '44 минуты на посещение',
      },
      {
        img: '/kartoshka.png',
        title: 'Крошка картошка',
        moveTime: '2 мин',
        remainingTime: '44 минуты на посещение',
      },
      {
        img: '/bk.png',
        title: 'Burger King',
        moveTime: '2 мин',
        remainingTime: '44 минуты на посещение',
      },
      {
        img: '/kartoshka.png',
        title: 'Крошка картошка',
        moveTime: '2 мин',
        remainingTime: '44 минуты на посещение',
      },
    ]
    if (this.cb) {
      this.cb(orgs)
    }
  }

  subscribe(cb) {
    this.cb = cb
    // TODO тут надо поставить таймер в минуту
    const timeout = 1000 // * 60
    this.timerId = setInterval(this.intervalHandler, timeout)
  }

  unSubscribe() {
    clearInterval(this.timerId)
  }
}
