<template>
  <div v-if="currentDocument" class="edit-form">
    <div class="select-post">
      <label class="glow">{{ currentDocument.name_document }}</label>
      <div>
        <input type="text" class="form-control" placeholder="Поиск по фио" v-model="searchName" />
        <select v-model="selectedPosition" id="select-position" class="form-control">
          <option value="" disabled>Выбрать должность</option>
          <option>Все</option>
          <option v-for="item in positionUser" v-bind:key="item.id_position">
            {{ item.name_position }}
          </option>
        </select>
      </div>
    </div>
    <div class="assign">
      <div class="date">
        <label>Дата начала</label>
        <input id="start-date" type="date" class="form-control" />
      </div>
      <div class="date">
        <label>Дата окончания</label>
        <input id="end-date" type="date" class="form-control" />
      </div>
      <div>
        <div class="form-group" id="data-about-document">
          <label for="explanation">Пояснение к работе</label>
          <textarea class="form-control" id="exp-area" v-model="explanation"></textarea>
        </div>
      </div>
      <div>
        <button type="button" id="btn-assign" class="btn btn-dark" @click="createWork()">Назначить</button>
      </div>
    </div>
    <div id="check-create-work">
      <input type="checkbox" />
      <p>Создать работу для каждого выбранного сотрудника</p>
    </div>
    <div class="global-div">
      <div class="table-document">
        <div id="table-header">
          <div class="h-title-checkbox"><input type="checkbox" id="select-all" title="Выбрать всех"
              @change="selectAll()"></div>
          <div class="h-title"><b>ФИО</b></div>
          <div class="h-title"><b>Почта</b></div>
          <div class="h-title"><b>Должность</b></div>
        </div>
        <div id="table-body" class="assign-user" v-for="item in sortedListUsersPos" v-bind:key="item.id">
          <div class="b-completion-checkbox" id="select" @change="handleChange($event, item.id)"><input
              type="checkbox" /></div>
          <div class="b-completion" id="fio-select">{{ item.fio }}</div>
          <div class="b-completion">{{ item.email }}</div>
          <div class="b-completion">{{ item.name_position }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!currentDocument">Что то пошло не так...... <a><i class="bi bi-emoji-frown"></i></a></div>
</template>
  
<script>
import documentService from "../services/document.service";
import userService from "../services/view_user.service";
import positionService from "../services/position.service";
import workDocumentService from "../services/work_document.service";
import workUserService from "../services/work_user.service";

export default {
  data() {
    return {
      currentDocument: null,
      users: [],
      positionUser: [],
      selectedPosition: "",
      workDocuments: [],
      workUsers: [],
      explanation: '',
      work_document: {
        id_work_document: null,
        id_document: null,
        start_date: null,
        end_date: null,
        id_user_init: null,
        id_parent: null,
        id_status: null,
        description: null,
        painting: null,
        complete_date: null,
        explanation: null,
      },
      searchName: '',
    };
  },
  computed: {
    sortedListWorkDoc() {
      return this.workDocuments.slice().sort((d1, d2) => (d1.id_work_document > d2.id_work_document) ? 1 : -1);
    },
    sortedListWorkUser() {
      return this.workUsers.slice().sort((d1, d2) => (d1.id_work_user > d2.id_work_user) ? 1 : -1);
    },
    sortedListUsersPos() {
      let position = this.selectedPosition;
      return this.sortedListUsersFio.filter(function (elem) {
        if (position === "") return true;
        if (position == "Все") return true;
        else return elem.name_position.includes(position);
      })
    },
    sortedListUsersFio() {
      let fio = this.searchName;
      return this.users.filter(function (elem) {
        if (fio === "") return true;
        else return elem.fio.includes(fio);
      })
    },
  },
  methods: {
    getDocument(id_document) {
      documentService.get(id_document)
        .then(response => {
          this.currentDocument = response.data;
          //console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    listEventUser() {
      userService.getAllUsers()
        .then((response) => {
          this.users = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventPosition() {
      positionService.getAllPosition()
        .then((response) => {
          this.positionUser = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventWorkDocument() {
      workDocumentService.getAllWorkDocument()
        .then((response) => {
          this.workDocuments = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventWorkUser() {
      workUserService.getAllWorkUser()
        .then((response) => {
          this.workUsers = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleChange(event, id) {
      event.target.dataset.id = id;
    },
    createWork() {
      try {
        if (!document.querySelector('#start-date').value && !document.querySelector('#end-date').value) {
          throw new Error('Даты не выбраны!');
        }
        if (document.querySelector('#start-date').value > document.querySelector('#end-date').value) {
          throw new Error('Дата начала не может быть больше даты окончания!');
        }
        const info = document.querySelectorAll('.assign-user');
        let assignUsers = [];
        info.forEach(elem => {
          if (elem.querySelector('#select').querySelector('input').checked == true) {
            const user = this.users.find(u => u.id == elem.querySelector('#select').querySelector('input').dataset.id)
            assignUsers = [...assignUsers, user];
          }
        });
        if (assignUsers.length == 0) throw new Error('Не выбран сотрудник!');
        if (document.querySelector('#check-create-work').querySelector('input').checked) {
          this.createEveryoneWork(assignUsers);
        }
        else {
          const idWorkDoc = this.sortedListWorkDoc[this.sortedListWorkDoc.length - 1].id_work_document + 1;
          const newWorkDocument = {
            id_work_document: idWorkDoc,
            id_document: this.currentDocument.id_document,
            start_date: document.querySelector('#start-date').value,
            end_date: document.querySelector('#end-date').value,
            id_user_init: this.$store.state.auth.user.id,
            id_parent: null,
            id_status: 3,
            description: null,
            painting: false,
            complete_date: null,
            explanation: this.explanation,
          };
          workDocumentService.create(newWorkDocument)
            .then(response => {
              console.log(response.data);
              if (response.statusText == "OK") {
                this.assignWorkUsers(assignUsers, newWorkDocument.id_work_document);
                alert('Назначение прошло успешно!')
              } else {
                throw new Error('Error');
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
      catch (error) {
        alert(error.message);
      }
    },
    assignWorkUsers(arr, idWD) {
      let count = 0;
      arr.forEach(user => {
        count++;
        const newWorkUser = {
          id_work_user: this.sortedListWorkUser[this.sortedListWorkUser.length - 1].id_work_user + count,
          id_work_document: idWD,
          id_user: user.id
        };
        workUserService.create(newWorkUser)
          .then(response => {
            if (response.statusText == "OK") {
              console.log(response.data);
              this.$router.push('/document-info/' + this.currentDocument.id_document);
            }
          })
          .catch(e => {
            console.log(e);
          });
      })
    },
    createEveryoneWork(assignUsers) {
      let count = 0;
      assignUsers.forEach(user => {
        count++;
        const idWorkDoc = this.sortedListWorkDoc[this.sortedListWorkDoc.length - 1].id_work_document + count;
        const newWorkDocument = {
          id_work_document: idWorkDoc,
          id_document: this.currentDocument.id_document,
          start_date: document.querySelector('#start-date').value,
          end_date: document.querySelector('#end-date').value,
          id_user_init: this.$store.state.auth.user.id,
          id_parent: null,
          id_status: 3,
          description: null,
          painting: false,
          complete_date: null,
          explanation: this.explanation,
        };
        const newWorkUser = {
          id_work_user: this.sortedListWorkUser[this.sortedListWorkUser.length - 1].id_work_user + count,
          id_work_document: idWorkDoc,
          id_user: user.id
        };
        workDocumentService.create(newWorkDocument)
          .then(response => {
            console.log(response.data);
            if (response.statusText == "OK") {
              workUserService.create(newWorkUser)
                .then(response => {
                  if (response.statusText == "OK") {
                    console.log(response.data);
                    this.$router.push('/document-info/' + this.currentDocument.id_document);
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            } else {
              throw new Error('Error');
            }
          })
          .catch(e => {
            console.log(e);
          })
      });
      alert('Назначение прошло успешно!')
    },
    //выбрать всех пользователей
    selectAll() {
      const checked = document.querySelector('#select-all').checked;
      const info = document.querySelectorAll('.assign-user');
      if (checked) {
        document.querySelector('#select-all').title = 'Отменить всех';
        info.forEach(elem => {
          elem.querySelector('#select').querySelector('input').checked = true;
        });
      } else {
        document.querySelector('#select-all').title = 'Выбрать всех';
        info.forEach(elem => {
          elem.querySelector('#select').querySelector('input').checked = false;
        });
      }
    },
    getNowDate() {
      const dateObj = new Date();
      const date = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
      document.querySelector('#start-date').value = date;
    },
  },
  mounted() {
    this.getDocument(this.$route.params.id_document);
    this.listEventUser();
    this.listEventPosition();
    this.listEventWorkDocument();
    this.listEventWorkUser();
    setTimeout((() => { this.getNowDate(); }), 1000);
  }
};
</script>

<style scoped>
.glow {
  font-size: 60px;
  color: #fff;
  text-align: center;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
  }

  to {
    text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
  }
}

.select-post div {
  display: flex;
}

.select-post div input,
.select-post div select {
  width: 350px;
  margin: 5px;
}

#check-create-work {
  display: flex;
  justify-content: center;
  vertical-align: center;
}

#check-create-work p {
  margin-top: 14px;
  margin-left: 10px;
}

#data-about-document{
  margin-right: 10px;
}
</style>
  
      