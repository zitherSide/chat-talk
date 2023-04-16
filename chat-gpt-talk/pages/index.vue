<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="ma-5 pa-3" sm="8" md="6">
      <div
        v-for="(msg, index) in $store.state.messages"
        :key="index"
        class="ma-5 pa-1 align-end"
      >
        <v-row>
          <v-spacer v-if="msg.sender === 'user'" />
          <v-card rounded-xl :color="bgColor(msg.sender)" min-width="300" class="my-3">
            <v-card-title>{{ msg.sender }}</v-card-title>
            <v-card-text>{{ msg.content }}</v-card-text>
          </v-card>
          <v-spacer v-if="msg.sender === 'got'" />
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
// import Logo from '~/components/Logo.vue'
// import VuetifyLogo from 's~/components/VuetifyLogo.vue'

const bgColor = (sender) => {
  return sender === 'user' ? 'primary' : 'secondary darken-4'
}

const messages = [
  {
    sender: 'user',
    content: 'Hello'
  },
  {
    sender: 'gpt',
    content: 'Hi'
  }
]

</script>
