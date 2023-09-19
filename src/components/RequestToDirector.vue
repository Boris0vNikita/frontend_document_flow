<template>
  <div class="submit-form">
    <div id="submitted" v-if="!submitted">
      <div class="form-group">
        <label for="name_document">Название документа</label>
        <input type="text" class="form-control" placeholder="Введите название" required v-model="nameDocument">
      </div>
      <div class="form-group">
        <label for="start_date">Дата начала</label>
        <input type="date" class="form-control" required v-model="startDate">
      </div>
      <div class="form-group">
        <label for="end_date">Дата окончания</label>
        <input type="date" class="form-control" required v-model="endDate">
      </div>
      <div class="form-group">
        <label for="description">Описание</label>
        <textarea type="text" placeholder="Введите описание" id="description" class="form-control" required
          v-model="description"></textarea>
      </div>
      <div class="form-group" v-if="selectedFiles">
        <label>Название файла</label>
        <input v-for="file in selectedFiles" :key="file.name" readonly="true" type="text" class="form-control" required
          v-model="file.name" />
      </div>
      <div class="form-group" id="select-file">
        <label class="btn btn-default">
          <input type="file" ref="file" @change="selectFile" />
        </label>
        <div v-if="currentFile" class="progress">
          <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" :aria-valuenow="progress"
            aria-valuemin="0" aria-valuemax="100" :style="{ width: progress + '%' }">
            {{ progress }}%
          </div>
        </div>
      </div>
      <button @click="saveDocument()" class="btn btn-dark">Отправить</button>
      <div class="success-message" role="alert">{{ message }}</div>
    </div>
  </div>
</template>
    
<script>
import documentService from "../services/document.service";
import uploadService from "../services/upload_files.service";
import workDocumentService from "../services/work_document.service";
import workUserService from "../services/work_user.service";
import userService from "../services/view_user.service";

export default {
  name: "order",
  data() {
    return {
      submitted: false,
      listDocuments: [],
      workDocuments: [],
      workUsers: [],
      users: [],
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      files: null,

      startDate: null,
      endDate: null,
      nameDocument: "",
      description: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    sortedListDocument() {
      return this.listDocuments.slice().sort((d1, d2) => (d1.id_document > d2.id_document) ? 1 : -1);
    },
    sortedListWorkDoc() {
      return this.workDocuments.slice().sort((d1, d2) => (d1.id_work_document > d2.id_work_document) ? 1 : -1);
    },
    sortedListWorkUser() {
      return this.workUsers.slice().sort((d1, d2) => (d1.id_work_document > d2.id_work_document) ? 1 : -1);
    },
  },
  methods: {
    selectFile(e) {
      this.selectedFiles = this.$refs.file.files;
      this.files = e.target.files;
    },
    getDirector() {
      const director = this.users.find(elem => elem.id_position === 1);
      return director;
    },
    getNowDate() {
      setTimeout((() => {
        const dateObj = new Date();
        const date = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
        this.startDate = date;
      }), 1000);
    },
    saveDocument() {
      try {
        if (this.nameDocument == "") throw new Error("Поле для названия не заполнено!");
        if (!this.startDate && !this.endDate) throw new Error('Даты не выбраны!');
        if (this.startDate > this.endDate) throw new Error('Дата начала не может быть больше даты окончания!');
        if (this.selectedFiles == undefined) throw new Error("Файл для загрузки не выбран!");
        if (this.files == null) throw new Error("Файл для загрузки не выбран!");

        this.progress = 0;
        this.currentFile = this.selectedFiles.item(0);
        uploadService.upload(this.currentFile, event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
          .then(response => {
            this.message = response.data.message;
            return uploadService.getFiles();
          })
          .then(files => {
            this.fileInfos = files.data;
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Не удалось загрузить файл!";
          });
        const idDoc = this.sortedListDocument[this.sortedListDocument.length - 1].id_document + 1;
        const newDoc = {
          id_document: idDoc,
          name_document: this.nameDocument,
          id_type_document: 13,
          way_to_file: 'no way',
          name_file: this.files[0].name,
          is_ready: false,
        };
        documentService.create(newDoc)
          .then(response => {
            //console.log(response.data);
            if (response.statusText == "OK") {
              this.submitted = true;
              this.saveWorkDocument(idDoc);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
      catch (err) {
        alert(err.message);
      }
    },
    saveWorkDocument(idDoc) {
      const idWorkDoc = this.sortedListWorkDoc[this.sortedListWorkDoc.length - 1].id_work_document + 1
      const newWorkDocument = {
        id_work_document: idWorkDoc,
        id_document: idDoc,
        start_date: this.startDate,
        end_date: this.endDate,
        id_user_init: this.currentUser.id,
        id_parent: null,
        id_status: 3,
        description: null,
        painting: false,
        complete_date: null,
        explanation: this.description,
      };
      const newWorkUser = {
        id_work_user: this.sortedListWorkUser[this.sortedListWorkUser.length - 1].id_work_user + 1,
        id_work_document: idWorkDoc,
        id_user: this.getDirector().id,
      };
      workDocumentService.create(newWorkDocument)
        .then(response => {
          //console.log(response.data);
          if (response.statusText == "OK") {
            workUserService.create(newWorkUser)
              .then(response => {
                if (response.statusText == "OK") {
                  //console.log(response.data);
                  alert("Заявка успешно отправлена!");
                  this.$router.push('/home');
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
    },
    newDocument() {
      this.submitted = false;
      this.document = {};
      this.selectedFiles = undefined;
      this.currentFile = undefined;
      this.files = null;
      this.message = "";
      this.listEventDocument();
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
  },
  mounted() {
    this.listEventDocument();
    this.listEventWorkDocument();
    this.listEventWorkUser();
    this.listEventUser();
    this.getNowDate();
    uploadService.getFiles().then(response => {
      this.fileInfos = response.data;
    });
  },
};
</script>