import axios from 'axios'

// TODO НЕ РАБОТАЕТ ТУТ НИХУЯ
export const RaceTracker = {
  apikey: '4a3fd1b3-a363-4a00-b0a9-e89198dd009d',
  schedule: undefined,
  url() {
    return `https://api.rasp.yandex.net/v3.0/schedule/?apikey=${this.apikey}&station=svo&transport_types=plane&system=iata`
  },
  async getSchedule() {
    // Получение расписания
    if (this?.schedule !== undefined) {
      return this.schedule
    }
    const response = await axios.get(this.url())
    return response.data
  },
  async exploreFlight(code) {
    const data = await this.getSchedule()
    return data.schedule.filter((item) => item.thread.number === code)
  },
  async getFlightsByTime(time) {
    // time is string like "00:12"
    const data = await this.getSchedule()
    return data.schedule.filter((item) => item.departure === time)
  },
  async getFlightsByCity(cityName) {
    // "Нью-Йорк"
    const data = await this.getSchedule()
    return data.schedule.filter((item) =>
      item.thread.title.toLowerCase().includes(cityName)
    )
  },
}
