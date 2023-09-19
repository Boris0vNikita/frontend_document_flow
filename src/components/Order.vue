<template>
  <div class="submit-form">
    <div id="submitted" v-if="!submitted">
      <div class="form-group">
        <label for="name_document">Название документа</label>
        <input type="text" class="form-control" required v-model="document.name_document">
      </div>
      <div class="form-group">
        <label>Тип документа</label>
        <select v-model="selected" class="form-control">
          <option value="" disabled>Выбрать тип документа</option>
          <option v-for="item in sortedList" v-bind:key="item.id_type_document"> {{ item.name_type }} </option>
        </select>
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
      <button @click="saveDocument()" class="btn btn-dark">Подтвердить</button>
      <div class="error-feedback" role="alert">{{ errorMessage }}</div>
      <div class="success-message" role="alert">{{ message }}</div>
    </div>
    <div v-else>
      <h4>Новый документ успешно загружен!</h4>
      <div class="after-adding">
        <button class="btn btn-success" @click="toAppoint()">Назначить сотрудника</button>
        <button class="btn btn-dark" @click="newDocument()">Назад</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import documentService from "../services/document.service";
import typeService from "../services/type_document.service";
import uploadService from "../services/upload_files.service";

const sortByID = (d1, d2) => (d1.id_type_document > d2.id_type_document) ? 1 : -1;
const sortByIDDoc = (d1, d2) => (d1.id_document > d2.id_document) ? 1 : -1;

export default {
  name: "order",
  data() {
    return {
      document: {
        id_document: null,
        name_document: "",
        id_type_document: null,
        way_to_file: "",
        name_file: "",
        is_ready: false,
      },
      selected: null,
      submitted: false,
      listType: [],
      listDocuments: [],
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      errorMessage: "",
      files: null,
      idDoc: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    //сортировка типов по id
    sortedList() {
      return this.listType.slice().sort(sortByID);
    },
    //сортировка документов по id
    sortedListIdDoc() {
      return this.listDocuments.slice().sort(sortByIDDoc);
    },
  },
  methods: {
    selectFile(e) {
      this.selectedFiles = this.$refs.file.files;
      this.files = e.target.files;
    },
    saveDocument() {
      try {
        if (this.document.name_document == "" || this.selected == null) throw new Error("Не все поля заполнены!");
        if (this.selectedFiles == undefined) throw new Error("Файл для загрузки не выбран!");
        if (this.files == null) throw new Error("Файл для загрузки не выбран!");

        this.progress = 0;
        this.currentFile = this.selectedFiles.item(0);
        this.errorMessage = "";
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
            this.erroMessage = "Не удалось загрузить файл!";
          });
        this.idDoc = this.sortedListIdDoc[this.sortedListIdDoc.length - 1].id_document + 1;
        const data = {
          id_document: this.idDoc,
          name_document: this.document.name_document,
          id_type_document: this.sortedList.find(el => el.name_type === this.selected).id_type_document,
          way_to_file: 'no way',
          name_file: this.files[0].name,
          is_ready: false,
        };
        documentService.create(data)
          .then(response => {
            console.log(response.data);
            this.submitted = true;
          })
          .catch(e => {
            console.log(e);
          });
      }
      catch (err) {
        this.errorMessage = "Ошибка: " + err.message;
      }
    },
    newDocument() {
      this.submitted = false;
      this.document = {};
      this.selected = null;
      this.selectedFiles = undefined;
      this.currentFile = undefined;
      this.files = null;
      this.message = "";
      this.errorMessage = "";
      this.listEventDocument();
    },
    toAppoint() {
      this.$router.push('/assign-employee/' + this.idDoc);
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
    listEventType() {
      typeService.getAllType()
        .then((response) => {
          this.listType = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.listEventType();
    this.listEventDocument();
    uploadService.getFiles().then(response => {
      this.fileInfos = response.data;
    });
  },
};
</script>