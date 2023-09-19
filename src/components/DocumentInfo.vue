<template>
  <div v-if="currentDocument">
    <modal-window ref="modal" :info='info' :child='child' />
    <div class="document-main-info">
      <h1 class="glow">{{ currentDocument.name_document }}</h1>
      <h1 class="header-glow">{{ currentDocument.name_type }}</h1>
    </div>
    <div class="global-div">
      <div class="table-document">
        <div id="table-header">
          <div class="h-title"><b>Исполнитель</b></div>
          <div class="h-title"><b>Поручитель</b></div>
          <div class="h-title"><b>Дата начала</b></div>
          <div class="h-title"><b>Дата окончания</b></div>
          <div class="h-title"><b>Статус</b></div>
          <div class="h-title"><b>Роспись</b></div>
        </div>
        <div id="table-body" v-for="item in filteredWork" v-bind:key="item.id_work_document">
          <div class="b-completion">{{ nameFormation(item.last_name, item.first_name, item.patronymic) }}</div>
          <div class="b-completion">{{ nameFormation(item.last_name_init, item.first_name_init, item.patronymic_init) }}
          </div>
          <div class="b-completion">{{ item.start_date }}</div>
          <div class="b-completion">{{ item.end_date }}</div>
          <div class="b-completion"><a @click="getChildren(item.id_work_document)"
              v-if="item.name_status === 'Переназначен'" id="info-about-assign">{{ item.name_status }}</a><a v-else>{{
    item.name_status
}}</a></div>
          <div class="b-completion">{{ renamePainting(item.painting) }}</div>
        </div>
      </div>
    </div>
    <div id="btn-document-info">
      <button id="btn-document-info" class="btn btn-dark" @click="goToAssignEmployee()"
        v-if="!currentDocument.is_ready">
        <a>Назначить сотрудника <i class="bi bi-person-plus"></i></a>
      </button>
      <button id="btn-document-info" class="btn btn-warning" @click="download()">
        <a>Скачать исходный файл <i class="bi bi-download"></i></a>
      </button>
    </div>
  </div>
  <div v-else-if="!currentDocument">Что то пошло не так...... <a><i class="bi bi-emoji-frown"></i></a></div>
</template>
  
<script>
import viewDocumentService from "../services/view_document.service";
import viewInfoDocumentService from "../services/view_info_work_doc.service";
import uploadService from "../services/upload_files.service";
import viewChildService from "../services/view_child_work.service";

import ModalWindow from './modal-window.vue';

export default {
  data() {
    return {
      currentDocument: null,
      workDocuments: [],
      fileInfos: [],
      child: null,
      info: 'информация'
    };
  },
  components: {
    ModalWindow
  },
  computed: {
    filteredWork() {
      const id = this.$route.params.id_document;
      return this.workDocuments.filter(elem => elem.id_document == id);
    },
  },
  methods: {
    showModal: function () {
      this.$refs.modal.show = true
    },
    sendDataFunction: function () {
      // обработчик отправки данных
    },
    renamePainting(painting) {
      if (painting) return 'Подписан';
      else return 'Не подписан';
    },
    download() {
      const fileName = this.currentDocument.name_file;
      const url = this.fileInfos.find(elem => elem.name.includes(fileName)).url;
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    nameFormation(lastName, firstName, patronymic) {
      return `${lastName} ${firstName[0]}. ${patronymic[0]}.`;
    },
    getDocument(id) {
      viewDocumentService.get(id)
        .then(response => {
          this.currentDocument = response.data;
          //console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getChildren(id) {
      this.child = this.childs.find(el => el.id_parent === id);
      if(this.child) this.showModal();
    },
    listChilds() {
      viewChildService.getAllChilds()
        .then((response) => {
          this.childs = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventWorkDocument() {
      viewInfoDocumentService.getAllInfoDocuments()
        .then((response) => {
          this.workDocuments = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAllFiles() {
      return uploadService.getFiles()
        .then(files => {
          this.fileInfos = files.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    goToAssignEmployee() {
      this.$router.push('/assign-employee/' + this.currentDocument.id_document);
    }
  },
  mounted() {
    this.getDocument(this.$route.params.id_document);
    this.listEventWorkDocument();
    this.listChilds();
    uploadService.getFiles().then(response => {
      this.fileInfos = response.data;
      //console.log(response.data)
    });
  }
};
</script>

<style scoped>
#info-about-assign {
  text-decoration: underline;
}

#info-about-assign:hover {
  color: white;
  font-weight: 700;
}

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

.header-glow {
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: #fdfdfe;
  text-shadow: 0px 0px 5px #b393d3, 0px 0px 10px #b393d3, 0px 0px 10px #b393d3,
    0px 0px 20px #b393d3;
}

#btn-document-info {
  margin: 1rem;
  text-align: center;
}
</style>
      