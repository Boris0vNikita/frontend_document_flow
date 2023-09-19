<template>
  <div class="mainContent">
    <div class="row">
      <div class="sorted-document">
        <input type="text" class="form-control" placeholder="Поиск по названию" v-model="searchName">
        <select v-model="selectedType" class="form-control">
          <option value="" disabled>Выбрать тип</option>
          <option>Все</option>
          <option v-for="item in type" v-bind:key="item.id_type">
            {{ item.name_type }}
          </option>
        </select>
        <select v-model="selectedDone" class="form-control">
          <option value="" disabled>Выбрать готовность</option>
          <option>Все</option>
          <option>Выполнено</option>
          <option>В работе</option>
        </select>
      </div>
    </div>
    <div class="global-div">
      <div class="table-document">
        <div id="table-header">
          <div class="h-title-name"><b>Название документа</b></div>
          <div class="h-title"><b>Тип</b></div>
          <div class="b-completion-button"><b></b></div>
        </div>
        <div id="table-body" v-for="item in filteredDone" v-bind:key="item.id_document">
          <div class="b-completion-name" v-if="item.is_ready" id="green-color" title="Выполнено">
            {{ item.name_document }}
          </div>
          <div class="b-completion-name" v-else title="В работе">{{ item.name_document }}</div>

          <div class="b-completion" v-if="item.is_ready" id="green-color" title="Выполнено">{{ item.name_type }}</div>
          <div class="b-completion" v-else title="В работе">{{ item.name_type }}</div>

          <div class="b-completion-button" v-if="item.is_ready" id="green-color" title="Выполнено">
            <button class="btn btn-dark" @click="goShowDocumentInfo(item)">Подробнее</button>
          </div>
          <div class="b-completion-button" v-else title="В работе">
            <button class="btn btn-dark" @click="goShowDocumentInfo(item)">Подробнее</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import viewDocumentService from "../services/view_document.service";
import typeService from "../services/type_document.service";
//нужно для сортировки по айди
const sortByID = (d1, d2) => (d1.id_document < d2.id_document) ? 1 : -1;

export default {
  data() {
    return {
      documents: [],
      type: [],
      currentDocument: null,
      searchName: "",
      selectedType: "",
      selectedDone: "",
    };
  },
  computed: {
    //сортировка массива program по айди
    sortedList() {
      return this.documents.slice().sort(sortByID);
    },
    //поиск по таблице
    searchTable() {
      const name = this.searchName;
      return this.sortedList.filter(function (elem) {
        if (name == "") return true;
        if (name != "") return elem.name_document.includes(name);
      })
    },
    //сортировка по типу документа
    filteredType() {
      const type = this.selectedType;
      return this.searchTable.filter(function (elem) {
        if (type === "") return true;
        if (type == "Все") return true;
        else return elem.name_type.includes(type);
      })
    },
    filteredDone() {
      const done = this.selectedDone;
      return this.filteredType.filter(function (elem) {
        if (done === "") return true;
        if (done == "Все") return true;
        if (done == "Выполнено") return elem.is_ready === true;
        if (done == "В работе") return elem.is_ready === false;
      })
    },
  },
  methods: {
    listEventDocument() {
      viewDocumentService.getAllDocuments()
        .then((response) => {
          this.documents = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listEventType() {
      typeService.getAllType()
        .then((response) => {
          this.type = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    goShowDocumentInfo(item) {
      this.currentDocument = item;
      this.$router.push('/document-info/' + this.currentDocument.id_document);
    }
  },
  mounted() {
    this.listEventDocument();
    this.listEventType();
  }
};
</script>
    
<style scoped>
.sorted-document {
  display: flex;
  text-align: center;
  justify-content: center;
}

.sorted-document input,
.sorted-document select {
  width: 350px;
  margin: 1rem;
}
</style>