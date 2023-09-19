<template>
  <div id="app">
    <div class="snowflakes" aria-hidden="true">
      <div class="snowflake">
          ❅
      </div>
      <div class="snowflake">
          ❅
      </div>
      <div class="snowflake">
          ❆
      </div>
      <div class="snowflake">
          ❄
      </div>
      <div class="snowflake">
          ❅
      </div>
      <div class="snowflake">
          ❆
      </div>
      <div class="snowflake">
          ❄
      </div>
      <div class="snowflake">
          ❅
      </div>
      <div class="snowflake">
          ❆
      </div>
      <div class="snowflake">
          ❄
      </div>
  </div>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" class="navbar-brand"></a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> Главная страница
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">Администратор</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="showAdminBoard || isDirector" to="/order" class="nav-link">Новый документ</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="showAdminBoard || isDirector" to="/list-document" class="nav-link"> Все документы
          </router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/work-user" class="nav-link" title="Текущая работа"> Работа ({{
              currentWorks
          }})</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser && !isDirector" to="/request-to-director" class="nav-link"> Отправить заявку
            директору </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Регистрация
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Войти
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.last_name + " " + currentUser.first_name[0] + ". " + currentUser.patronymic[0] + "." }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> Выход
          </a>
        </li>
      </div>
    </nav>

    <router-view />

  </div>
</template>

<script>
import viewInfoDocumentService from "./services/view_info_work_doc.service";
import userService from "./services/view_user.service";

export default {
  data() {
    return {
      userWorks: null,
      currentWorks: 0,
      users: null,
      isDirector: false,
    }
  },
  computed: {
    currentUser() {
      this.getWorks();
      this.getUsers();
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('MODERATOR');
      }
      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    getUsers() {
      userService.getAllUsers()
        .then((response) => {
          this.users = response.data;
          if (response.statusText == "OK") {
            if (this.currentUser) {
              this.getPositionUser();
            }
            //console.log(response.data);
          } else throw new Error('Error');
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPositionUser() {
      const user = this.users.find(elem => elem.id === this.$store.state.auth.user.id);
      this.isDirector = false;
      if (user.id_position === 1) this.isDirector = true;
    },
    getWorks() {
      viewInfoDocumentService.getAllInfoDocuments()
        .then(response => {
          this.userWorks = response.data;
          if (response.statusText == "OK") {
            if (this.currentUser) {
              this.sortingWorks(this.userWorks);
            }
            //console.log(response.data);
          } else throw new Error('Error');
        })
        .catch(e => {
          console.log(e);
        });
    },
    sortingWorks(works) {
      let sorted = [...works.filter(elem => elem.painting === false && elem.id_user === this.$store.state.auth.user.id)];
      this.currentWorks = sorted.length;
      let getStarted = false;
      if (sorted.length > 0) getStarted = confirm(`Нужно выполнить работ: ${sorted.length}\nПриступить к выполнению?`);
      if (getStarted) this.$router.push('/work-user');
    },
  },
};
</script>

































































<style src="../src/css/style.css"/>