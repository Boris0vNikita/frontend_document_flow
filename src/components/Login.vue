<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" class="profile-img-card" />
      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-group">
          <label for="login">Логин</label>
          <Field name="login" type="text" class="form-control" />
          <ErrorMessage name="login" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="input-wrapper">
            <Field name="password" type="password" id="password" class="form-control" />
            <div id="hide-password" v-on:click="togglePasword()">
              <a v-if="hide == '1'"><i class="bi bi-eye-fill"></i> скрыть пароль</a>
              <a v-if="hide == ''"><i class="bi bi-eye-slash-fill"></i> показать пароль</a>
            </div>
          </div>
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="form-group">
          <button class="btn btn-dark btn-block" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span> Войти </span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      login: yup.string().required("Требуется ввести логин!"),
      password: yup.string().required("Требуется ввести пароль!"),
    });
    return {
      loading: false,
      message: "",
      schema,
      hide: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/profile");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    togglePasword() {
      const input = document.getElementById('password');
      //const icon = document.getElementById('icon');
      if (input.type === "password") {
        this.hide = "1";
        input.type = "text";
        //icon.classList.add('selected');
      } else {
        this.hide = "";
        input.type = "password";
        //icon.classList.remove('selected');
      }
    }
  },
};
</script>
