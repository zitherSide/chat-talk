export const state = () => ({
  messages: []
})

export const mutations = {
  add (state, { sender, content }) {
    state.messages.push({
      sender,
      content
    })
  }
}
