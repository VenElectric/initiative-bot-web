<template>
  <div class="flex justify-center">
    <div
      class="
        flex flex-col
        self-center
        shadow-2xl
        bg-gradient-to-b
        from-gray-400
        rounded-lg
        mt-60
      "
    >
      submit.prevent add back in
      <form class="shadow-inner">
        <div class="flex-initial p-5">
          <label class="flex self-start" for="email">E-mail</label>
          <input
            class="
              flex
              border-2
              self-end
              placeholder-gray-400
              rounded-md
              h-10
              w-80
              mt-5
            "
            type="email"
            name="email"
            placeholder="writer@example.com"
          />
        </div>
        <div class="flex-initial p-5">
          <label class="flex self-start" for="password">Password</label>
          <input
            class=""
            type="password"
            name="password"
            v-model="password"
            placeholder="password"
          />
        </div>
        <div v-if="false">error message</div>
        <button
          class="
            border-2
            p-4
            m-4
            transition
            duration-500
            ease-in-out
            bg-gray-200
            border-gray-400
            hover:bg-blue-200
          "
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      errormsg: null,
      password: null,
      email: null,
    };
  },
  setup() {
    const auth = getAuth();
    const router = useRouter();

    const login = reactive({ email: "", password: "", errormsg: "" });
    const login_user = async () => {
      try {
        await signInWithEmailAndPassword(auth, login.email, login.password);
        router.push("/");
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        login.errormsg = error.message;
      }
    };
    return { login_user, login };
  },
});
</script>

<style>
.user {
  height: 50px;
}
</style>
