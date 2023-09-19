<template>
  <div v-if="currentDocument" id="main-reassign">
    <div id="reassign-data">
      <div>
        <div id="data-about-document" class="form-group">
          <label>Дата начала</label>
          <input v-model="startDateReassign" type="date" class="form-control" />
        </div>
        <div id="data-about-document" class="form-group">
          <label>Дата окончания</label>
          <input v-model="endDateReassign" type="date" class="form-control" />
        </div>
      </div>
      <div>
        <div class="form-group" id="data-about-document">
          <label for="name_document">Название документа</label>
          <input type="text" class="form-control" required v-model="currentDocument.name_document">
        </div>
        <div class="form-group" id="data-about-document">
          <label>Тип документа</label>
          <select v-model="currentDocument.name_type" class="form-control">
            <option value="" disabled>Выбрать тип документа</option>
            <option v-for="item in sortedList" v-bind:key="item.id_type_document"> {{ item.name_type }} </option>
          </select>
        </div>
      </div>
      <div>
        <div class="form-group" id="data-about-document">
          <label for="explanation">Описание работы</label>
          <textarea class="form-control" id="description" v-model="currentDocument.explanation"></textarea>
        </div>
      </div>
      <div>
        <div class="form-group" id="data-about-document">
          <label for="explanation">Причина переназначения</label>
          <textarea class="form-control" id="description" v-model="description"></textarea>
        </div>
      </div>
    </div>
    <div id="sorting-position">
      <select v-model="selectedPosition" id="data-about-document" class="form-control" title="Сортировка по должности">
        <option value="" disabled>Выбрать должность</option>
        <option>Все</option>
        <option v-for="item in positionUser" v-bind:key="item.id_position">
          {{ item.name_position }}
        </option>
      </select>
    </div>
    <div id="btn-reassign">
      <button type="button" id="btn-assign" class="btn btn-dark" @click="Reassign()">Поручить</button>
    </div>
    <div class="global-div">
      <div class="table-document">
        <div id="table-header">
          <div class="h-title-checkbox"></div>
          <div class="h-title"><b>ФИО</b></div>
          <div class="h-title"><b>Почта</b></div>
          <div class="h-title"><b>Должность</b></div>
        </div>
        <div id="table-body" class="assign-user" v-for="item in sortedListUsers" v-bind:key="item.id">
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
import typeService from "../services/type_document.service";
import userService from "../services/view_user.service";
import positionService from "../services/position.service";
import viewInfoDocumentService from "../services/view_info_work_doc.service";
import documentService from "../services/document.service";
import workDocumentService from "../services/work_document.service";
import workUserService from "../services/work_user.service";

export default {
  name: "reassign-work",
  data() {
    return {
      listType: [],
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      files: null,

      selectedPosition: '',
      users: [],
      positionUser: [],

      currentDocument: null,
      listDocuments: [],

      startDateReassign: null,
      endDateReassign: null,

      workDocuments: [],

      description: '',
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    sortedList() {
      return this.listType.slice().sort((d1, d2) => (d1.id_type_document > d2.id_type_document) ? 1 : -1);
    },
    sortedListUsers() {
      let position = this.selectedPosition;
      return this.users.filter(function (elem) {
        if (position === null) return true;
        if (position == 'Все') return true;
        else return elem.name_position.includes(position);
      });
    },
    sortedListIdDoc() {
      return this.listDocuments.slice().sort((d1, d2) => (d1.id_document > d2.id_document) ? 1 : -1);
    },
    sortedListWorkDoc() {
      return this.workDocuments.slice().sort((d1, d2) => (d1.id_work_document > d2.id_work_document) ? 1 : -1);
    },
    sortedListWorkUser() {
      return this.workUsers.slice().sort((d1, d2) => (d1.id_work_user > d2.id_work_user) ? 1 : -1);
    },
  },
  methods: {
    getNowDate() {
      const dateObj = new Date();
      const date = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
      this.startDateReassign = date;
    },
    selectFile(e) {
      this.selectedFiles = this.$refs.file.files;
      this.files = e.target.files;
    },
    listEventType() {
      typeService.getAllType()
        .then((response) => {
          this.listType = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
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
    listEventDocument() {
      documentService.getAllDocument()
        .then((response) => {
          this.listDocuments = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getDocument(id) {
      viewInfoDocumentService.get(id)
        .then(response => {
          this.currentDocument = response.data;
          console.log(response.data);
        })
        .catch(e => {
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
    Reassign() {
      try {
        if (this.startDateReassign === null || this.endDateReassign === null) throw new Error("Не все даты выбраны!");
        if (this.startDateReassign > this.endDateReassign) throw new Error("Дата начала не может быть больше даты конца!");
        if (this.currentDocument.name_document == '') throw new Error("Не введено название документа!");
        if (this.currentDocument.name_type == '') throw new Error("Не выбран тип документа!");
        if (this.currentDocument.explanation == '') throw new Error("Описание работы не заполнено!");
        if (this.currentDocument.description == '') throw new Error("Причина переназначения не заполнена!");

        const info = document.querySelectorAll('.assign-user');
        let assignUser = null;
        info.forEach(elem => {
          if (elem.querySelector('#select').querySelector('input').checked == true) {
            assignUser = this.users.find(u => u.id == elem.querySelector('#select').querySelector('input').dataset.id)
          }
        });
        if (assignUser == null) throw new Error('Не выбран сотрудник!');

        let idDoc = this.sortedListIdDoc[this.sortedListIdDoc.length - 1].id_document + 1;

        const newDocument = {
          id_document: idDoc,
          name_document: this.currentDocument.name_document,
          id_type_document: this.sortedList.find(el => el.name_type === this.currentDocument.name_type).id_type_document,
          way_to_file: 'no way',
          name_file: this.currentDocument.name_file,
          is_ready: false,
        };

        let idWorkDoc = this.sortedListWorkDoc[this.sortedListWorkDoc.length - 1].id_work_document + 1;
        const newWorkDocument = {
          id_work_document: idWorkDoc,
          id_document: idDoc,
          start_date: this.startDateReassign,
          end_date: this.endDateReassign,
          id_user_init: this.$store.state.auth.user.id,
          id_parent: this.currentDocument.id_work_document,
          id_status: 3,
          description: null,
          painting: false,
          complete_date: null,
          explanation: this.currentDocument.explanation,
        };

        const newWorkUser = {
          id_work_user: this.sortedListWorkUser[this.sortedListWorkUser.length - 1].id_work_user + 1,
          id_work_document: idWorkDoc,
          id_user: assignUser.id,
        };

        console.log(newWorkDocument);
        console.log(newWorkUser);
        console.log(newDocument);

        documentService.create(newDocument)
          .then(response => {
            //console.log(response.data);
            if (response.statusText == "OK") {

              workDocumentService.create(newWorkDocument)
                .then(response => {
                  //console.log(response.data);
                  if (response.statusText == "OK") {

                    workUserService.create(newWorkUser)
                      .then(response => {
                        if (response.statusText == "OK") {

                          this.updateWork();
                          //console.log(response.data);
                          alert('Назначение прошло успешно!')
                          this.$router.push('/work-user/');
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
                });
            }
          })
          .catch(e => {
            console.log(e);
          });
      } catch (err) {
        alert(err.message);
      }
    },
    updateWork() {
      const work = this.workDocuments.find(elem => elem.id_work_document == this.currentDocument.id_work_document);
      work.id_status = 9;
      work.painting = true;
      work.description = this.description;
      console.log(work)
      workDocumentService.update(work.id_work_document, work)
        .then(response => {
          if (response.statusText == "OK") {
            //console.log(response.data);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleChange(event, id) {
      event.target.dataset.id = id;
      const info = document.querySelectorAll('.assign-user');
      info.forEach(elem => {
        elem.querySelector('#select').querySelector('input').checked = false;
      });
      event.target.checked = true;
    },
  },
  mounted() {
    setTimeout((() => { this.getNowDate(); }), 1000);
    this.listEventType();
    this.listEventUser();
    this.listEventPosition();
    this.listEventDocument();
    this.listEventWorkDocument();
    this.listEventWorkUser();
    this.getDocument(this.$route.params.id_document);
  },
};
</script>

<style scoped>
#data-about-document {
  width: 350px;
}

#main-reassign {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

#data-about-document {
  margin-left: auto;
  margin-right: auto;
}

#btn-reassign {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

#sorting-position {
  margin-bottom: 20px;
  margin-top: 10px;
  text-align: center;
  justify-content: center;
}

#reassign-data {
  display: flex;
}

#reassign-data div {
  width: 80%;
}
</style>