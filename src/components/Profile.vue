<template>
  <div class="container">

    <main class="container">
      <div class="d-flex align-items-center p-3 my-3 text-white bg-light rounded shadow-sm">
        <i class="bi-person-circle h1 text-dark"></i>
        <div class="lh-1">
          <h1 class="h1 mb-0 text-black lh-1">{{ currentUser.first_name + " " + currentUser.last_name + " " +
              currentUser.patronymic
          }}</h1>
        </div>
      </div>

      <div class="my-3 p-3 rounded shadow-sm ">
        <div class="my-3 p-3 bg-body rounded shadow-sm">
          <h6 class="border-bottom pb-2 mb-0">Почта пользователя</h6>
          <div class="d-flex text-muted pt-3">
            <svg id="mail" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
              class="bi bi-envelope-fill" viewBox="0 0 16 16">
              <path
                d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
            </svg>

            <p class="pb-3 mb-0 small lh-sm ">
              {{ currentUser.email }}
            </p>


          </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
          <h6 class="border-bottom pb-2 mb-0">Роль</h6>
          <div class="d-flex text-muted pt-3">
            <svg id="rolest" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
              class="bi bi-person-badge" viewBox="0 0 16 16">
              <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z" />
            </svg>
            <p class="pb-3 mb-0 small lh-sm">
            <ul>
              <li v-for="role in currentUser.roles" :key="role">{{ role }}</li>
            </ul>
            </p>
          </div>
        </div>

        <div class="my-3 p-3 bg-body rounded shadow-sm">
          <h6 class="border-bottom pb-2 mb-0">Должность</h6>
          <div class="d-flex text-muted pt-3">
            <svg id="rolest" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
              class="bi bi-person-badge" viewBox="0 0 16 16">
              <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z" />
            </svg>
            <p class="pb-3 mb-0 small lh-sm">
            <ul>
              <h5 v-for="posit in sortUser()" :key="posit">{{ posit.name_position }}</h5>
            </ul>
            </p>
          </div>
        </div>

        <button type="button" id="btn-upd" class="btn btn-light" @click="sortUser()">Обновить данные о
          пользователе</button>
      </div>


    </main>

  </div>
</template>


<script>
import userService from "../services/view_user.service";

export default {
  name: 'Profile',
  data() {
    return {
      /*user_post: {
        id: null,
        user_id: null,
        post_id: null
      },
      selected: null,
      submitted: false,
      selectedIndex: 0,
      program: [],
      poster:[],
      rating: [],
      search_input: "",
      search_post: ""*/
      SelectUser: null,
      position: null,
      users: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    sortUser() {
      const id = this.$store.state.auth.user.id;
      let newid = [];
      console.log(id);
      let user = this.users.find(el => el.id === id);
      console.log(user)
      newid = [...this.users.filter(elem => elem.id == id)];
      console.log(id);
      return newid;
    },
    listEventUser() {
      userService.getAllUsers()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

  },
  mounted() {
    this.listEventUser();
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>

<style>
#mail {
  margin-right: 15px;
  color: rgb(164, 131, 202);
}

#rolest {
  color: rgb(164, 131, 202);
}

#btn-upd:hover {
  background-color: #edd4ff;
}

.rounded {
  background: rgb(164, 131, 202);
}

.bi-person-circle {
  margin-left: 10px;
  margin-top: 10px;
  margin-right: 15px;
}
</style>