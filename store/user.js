export const state = () => ({
  questions: {
    baggage: null,
    wheelchair: null,
    briefcase: null,
  },
  race: null,
  city: null,
  departureTime: null,
  floor: null,
})

export const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  setRace(state, race) {
    state.race = race
  },
  setCity(state, city) {
    state.city = city
  },
  setDepartureTime(state, departureTime) {
    state.departureTime = departureTime
  },
  setFloor(state, floor) {
    state.floor = floor
  },
}
