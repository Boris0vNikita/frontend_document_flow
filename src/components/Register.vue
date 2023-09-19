<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" class="profile-img-card" />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="first_name">Имя</label>
            <Field name="first_name" type="text" class="form-control" />
            <ErrorMessage name="first_name" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="last_name">Фамилия</label>
            <Field name="last_name" type="text" class="form-control" />
            <ErrorMessage name="last_name" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="patronymic">Отчество</label>
            <Field name="patronymic" type="text" class="form-control" />
            <ErrorMessage name="patronymic" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Почта</label>
            <Field name="email" type="email" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="login">Логин</label>
            <Field name="login" type="text" class="form-control" />
            <ErrorMessage name="login" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <div class="input-wrapper">
              <Field name="password" type="password" id="password" class="form-control" />
              <div id="hide-password" v-on:click="togglePassword()">
                <a v-if="hide == '1'"><i class="bi bi-eye-fill"></i> скрыть пароль</a>
                <a v-if="hide == ''"><i class="bi bi-eye-slash-fill"></i> показать пароль</a>
              </div>
            </div>
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <div class="form-group">
            <label for="id_department">Кафедра</label>
            <select name="id_department" v-model="selectedDepartment" class="form-control">
              <option value="" disabled>Выбрать кафедру</option>
              <option v-for="item in departments" v-bind:key="item.id_department">
                {{ item.name_department }}
              </option>
            </select>
            <ErrorMessage name="user_position" class="error-feedback" />
          </div>

          <div class="form-group">
            <label for="user_position">Должность</label>
            <select name="user_position" v-model="selected" class="form-control">
              <option value="" disabled>Выбрать должность</option>
              <option v-for="item in sortedList" v-bind:key="item.id_position">
                {{ item.name_position }}
              </option>
            </select>
            <ErrorMessage name="user_position" class="error-feedback" />
          </div>
          <div class="form-group">
            <button class="btn btn-dark btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm"></span>
              Зарегистрироваться
            </button>
          </div>
        </div>
      </Form>
      <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import userPositionService from "../services/user_position.service";
import userService from "../services/user_update.service";
import positionService from "../services/position.service";
import departmentService from "../services/department.service";
import viewUserService from "../services/view_user_registr.service";
import viewUserAll from "../services/view_user.service";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    const schema = yup.object().shape({
      login: yup
        .string()
        .required("Требуется ввести логин!")
        .min(5, "Должно быть минимум 5 символов!")
        .max(30, "Нельзя ввести больше 30 символов!"),
      email: yup
        .string()
        .required("Требуется ввести адрес почты!")
        .email("Почта введена неправильно!")
        .max(100, "Нельзя ввести больше 100 символов!"),
      password: yup
        .string()
        .required("Требуется ввести пароль!")
        .min(6, "Должно быть минимум 6 символов!")
        .max(30, "Нельзя ввести больше 30 символов!"),
      first_name: yup
        .string()
        .required("Требуется ввести имя!")
        .min(2, "Должно быть минимум 2 символов!")
        .max(30, "Нельзя ввести больше 30 символов!"),
      last_name: yup
        .string()
        .required("Требуется ввести фамилию!")
        .min(2, "Должно быть минимум 2 символов!")
        .max(30, "Нельзя ввести больше 30 символов!"),
      patronymic: yup
        .string()
        .required("Требуется ввести отчество!")
        .min(2, "Должно быть минимум 2 символов!")
        .max(30, "Нельзя ввести больше 30 символов!"),
    });
    return {
      selected: null,
      successful: false,
      loading: false,
      message: "",
      schema,
      hide: "",
      program: [],
      user_positions: [],
      users: [],
      departments: [],
      selectedDepartment: null,
      viewUsers: [],
      allUsers: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    sortedList() {
      return this.program.slice().sort((d1, d2) => (d1.id_position > d2.id_position) ? 1 : -1);
    },
    sortedListUser() {
      return this.users.slice().sort((d1, d2) => (d1.id > d2.id) ? 1 : -1);
    },
    sortedListPosition() {
      return this.user_positions.slice().sort((d1, d2) => (d1.id_user_position > d2.id_user_position) ? 1 : -1);
    },
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      const chief=this.allUsers.find(el=>el.id_position==1);
      if(chief) return alert("Должность директора уже имеется!");
      if (this.sortedList.find(el => el.name_position == this.selected).id_position != 1) {
        user.id_department = this.getIdDepartment().id_department;
        user.id_chief = this.getIdChief();
      } else {
        user.id_department = null;
        user.id_chief = null;
      }

      console.log(user)
      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;

          this.listEventUser();
          setTimeout(() => {
            this.saveUserPosition();
          }, 1000);
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
    saveUserPosition() {
      const data = {
        id_user_position: this.sortedListPosition[this.sortedListPosition.length - 1].id_user_position + 1,
        id_user: this.sortedListUser[this.sortedListUser.length - 1].id,
        id_position: this.sortedList.find(el => el.name_position === this.selected).id_position,
      };
      console.log(data)
      userPositionService.create(data)
        .then(response => {
          console.log(response.data);
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getIdChief(){
      const idDep = this.departments.find(elem => elem.name_department == this.selectedDepartment).id_department;
      const idPos = this.sortedList.find(el => el.name_position === this.selected).id_position;
      alert(idDep);
      alert(idPos);
       //если директор
       let idChief = null;
      //если зав. кафедры
      if (idPos === 3) idChief = this.allUsers.find(elem => elem.id_position === 1).id;
      //если любая другая должность
      if (idPos !== 3) idChief = this.viewUsers.find(elem => elem.id_position === 3 && elem.id_department === idDep).id;
      return idChief;
    },
    getIdDepartment() {
      return this.departments.find(elem => elem.name_department == this.selectedDepartment);
    },
    togglePassword() {
      const input = document.getElementById('password');
      if (input.type === "password") {
        this.hide = "1";
        input.type = "text";
      } else {
        this.hide = "";
        input.type = "password";
      }
    },
    listEventPosition() {
      positionService.getAllPosition()
        .then((response) => {
          this.program = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventUsers() {
      viewUserAll.getAllUsers()
        .then((response) => {
          this.allUsers = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventDepartment() {
      departmentService.getAllDepartment()
        .then((response) => {
          this.departments = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventViewUsers() {
      viewUserService.getAllUsersRegistr()
        .then((response) => {
          this.viewUsers = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventUserPosition() {
      userPositionService.getAllUserPosition()
        .then((response) => {
          this.user_positions = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventUser() {
      userService.getAllUser()
        .then((response) => {
          this.users = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.listEventPosition();
    this.listEventUserPosition();
    this.listEventUser();
    this.listEventDepartment();
    this.listEventViewUsers();
    this.listEventUsers();
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  }
};
</script>
