<template>
  <div id="work-user">
    <button class="tablink" @click="openPage('all-tasks')">Все задания</button>
    <button class="tablink" @click="openPage('assignments')">Поручения</button>

    <div id="all-tasks" class="tabcontent">
      <div class="list row gy-2">
        <div class="col-md-8">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Поиск по названию" v-model="nameDocument"
              @input="sortDocs()" />
            <select v-model="selectedDone" id="select-position" class="form-control">
              <option value="" disabled>Выбрать статус</option>
              <option>Все</option>
              <option v-for="item in listStatus" v-bind:key="item.id_status">{{ item.name_status }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <h2>Вся работа пользователя</h2>
          <ul class="list-group" id="list-doc-work">
            <li class="list-group-item" :class="{ active: index == currentIndex }"
              v-for="(document, index) in sortDocs()" :key="index" @click="setActiveDocument(document, index)">
              <div>
                {{ document.name_document }} <i v-show="false">{{ document.id_work_document }}</i>
                <i v-if="document.id_status == 4" title="Подписано" id="change-icon" class="bi bi-check-lg" />
                <i v-if="document.id_status == 8" title="Отказ" id="change-icon" class="bi bi-x-lg" />
                <i v-if="document.id_status == 3" title="Новая" id="change-icon" class="bi bi-emoji-expressionless"></i>
                <i v-if="document.id_status == 9" title="Переназначено" id="change-icon"
                  class="bi bi-arrow-up-right-circle" />
              </div>
            </li>
          </ul>
        </div>
        <div class="col-md-6" id="list-work">
          <div v-if="currentWork">
            <h4>Документ</h4>
            <div>
              <label><strong>Название:</strong></label> {{ currentWork.name_document }}
            </div>
            <div>
              <label><strong>Тип:</strong></label> {{ currentWork.name_type }}
            </div>
            <div>
              <label><strong>Статус:</strong></label> {{ currentWork.name_status }}
            </div>
            <div>
              <label><strong>Дата начала:</strong></label> {{ currentWork.start_date }}
            </div>
            <div>
              <label><strong>Дата конца:</strong></label> {{ currentWork.end_date }}
            </div>
            <div>
              <label><strong>Поручитель:</strong></label> {{ nameFormation(currentWork.last_name_init,
                  currentWork.first_name_init, currentWork.patronymic_init)
              }}
            </div>
            <div v-if="currentWork.explanation" id="explanation">
              <label><strong>Задание:</strong></label> {{ currentWork.explanation }}
            </div>
            <div v-if="currentWork.description" id="explanation">
              <label><strong>Описание работы:</strong></label> {{ currentWork.description }}
            </div>
            <div v-if="done === false || !done">
              <button class="btn btn-dark" @click="goToReassign()">Поручить</button>
            </div>
            <div id="submitted" class="work-element" v-if="done === false || !done">
              <div class="form-group">
                <label>Работа с документом</label>
                <div>
                  <input id="painting-work" type="checkbox">
                  <label>Роспись</label>
                </div>
              </div>
              <textarea id="description" placeholder="Описание работы"></textarea>
              <button class="btn btn-warning" @click="download()">
                <a>Скачать исходный файл <i class="bi bi-download"></i></a>
              </button>
              <div id="btn-perform-reject">
                <button @click="perform()" class="btn btn-dark">Выполнить</button>
                <button @click="reject()" class="btn btn-danger">Отказ</button>
              </div>
            </div>
            <div v-else-if="currentWork.id_status == 4">
              <br />
              <p>Работа выполнена!</p>
            </div>
            <div v-else-if="currentWork.id_status == 8">
              <br />
              <p>Отказ!</p>
            </div>
            <div v-else-if="currentWork.id_status == 9">
              <br />
              <p>Переназначено!</p>
            </div>
          </div>
          <div v-else>
            <br />
            <p>Кликните по документу, чтобы получить необходимую информацию...</p>
          </div>
        </div>
      </div>
    </div>

    <div id="assignments" class="tabcontent">
      <div class="seacrh-string">
        <input type="text" class="form-control" placeholder="Поиск по названию" v-model="searchAssignDoc"
          @input="sortAsssign()" />
        <select v-model="selectedAssign" id="select-position" class="form-control">
          <option value="" disabled>Выбрать статус</option>
          <option>Все</option>
          <option v-for="item in listStatus" v-bind:key="item.id_status">{{ item.name_status }}</option>
        </select>
      </div>
      <div class="list row gy-2">
        <ul class="list-assignments">
          <li v-for="item in sortAssign()" v-bind:key="item.id_work_document">
            <div v-if="item.id_status == 4" id="green-color" title="Выполнено">
              {{ item.name_document }}
              <i title="Больше информации" @click="showInfo($event, item)" id="change-icon"
                class="bi bi-info-square"></i>
            </div>
            <div v-else-if="item.id_status == 3" id="blue-color" title="В работе">
              {{ item.name_document }}
              <i title="Больше информации" @click="showInfo($event, item)" id="change-icon"
                class="bi bi-info-square"></i>
            </div>
            <div v-else-if="item.id_status == 8" id="red-color" title="Отказано">
              {{ item.name_document }}
              <i title="Больше информации" @click="showInfo($event, item)" id="change-icon"
                class="bi bi-info-square"></i>
            </div>
            <div v-else-if="item.id_status == 9" id="yellow-color" title="Переназначено">
              {{ item.name_document }}
              <i title="Больше информации" @click="showInfo($event, item)" id="change-icon"
                class="bi bi-info-square"></i>
            </div>
          </li>
        </ul>
        <div class="col-md-6" id="list-work">
          <div v-if="currentAssign">
            <h4>Поручение</h4>
            <div>
              <label><strong>Название:</strong> {{ currentAssign.name_document }} </label>
            </div>
            <div>
              <label><strong>Тип:</strong> {{ currentAssign.name_type }} </label>
            </div>
            <div>
              <label><strong>Статус:</strong> {{ currentAssign.name_status }} </label>
            </div>
            <div>
              <label><strong>Дата начала:</strong> {{ currentAssign.start_date }} </label>
            </div>
            <div>
              <label><strong>Дата конца:</strong> {{ currentAssign.end_date }} </label>
            </div>
            <div>
              <label><strong>Исполнитель:</strong> {{ nameFormation(currentAssign.last_name, currentAssign.first_name,
                  currentAssign.patronymic)
              }} </label>
            </div>
          </div>
          <div v-else>
            <br />
            <p>Кликните по документу, чтобы получить необходимую информацию...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import viewInfoDocumentService from "../services/view_info_work_doc.service";
import viewDocService from "../services/view_document.service";
import uploadService from "../services/upload_files.service";
import workDocumentService from "../services/work_document.service";
import documentService from "../services/document.service";
import statusService from "../services/status.service";

export default {
  name: "work-list",
  data() {
    return {
      userWorks: [],
      works: [],
      currentWork: null,
      currentDoc: null,
      documents: [],
      currentIndex: -1,
      nameDocument: '',
      currentAssign: null,
      fileInfos: [],
      changedWorkDocument: {
        id_work_document: null,
        id_document: null,
        start_date: null,
        end_date: null,
        id_user_init: null,
        id_parent: null,
        id_status: null,
        description: null,
        painting: false,
      },
      done: false,
      searchAssignDoc: '',
      selectedDone: '',
      selectedAssign: '',
      updatedDocument: null,
      listStatus: [],
    };
  },
  methods: {
    //вывод данных в лист поручений и поиск поручения по названию документа
    sortAssign() {
      const id = this.$store.state.auth.user.id;
      const value = this.searchAssignDoc;
      let newArr = [];
      newArr = [...this.userWorks.filter(elem => elem.id_user_init == id)];
      if (this.selectedAssign) {
        if (this.selectedAssign === 'Все') return newArr;
        const idStatus = this.listStatus.find(elem => elem.name_status === this.selectedAssign).id_status;
        newArr = [...newArr.filter(elem => elem.id_status === idStatus)];
      }
      if (!value) return newArr;
      else return newArr.filter(elem => elem.name_document.includes(value));
    },
    //вывод данных в лист работы и поиск работы по названию документа
    sortDocs() {
      const id = this.$store.state.auth.user.id;
      const value = this.nameDocument;
      let newArr = [];
      newArr = [...this.userWorks.filter(elem => elem.id_user == id)];
      if (this.selectedDone) {
        if (this.selectedDone === 'Все') return newArr;
        const idStatus = this.listStatus.find(elem => elem.name_status === this.selectedDone).id_status;
        newArr = [...newArr.filter(elem => elem.id_status === idStatus)];
      }
      if (!value) return newArr;
      else return newArr.filter(elem => elem.name_document.includes(value));
    },
    nameFormation(lastName, firstName, patronymic) {
      return `${lastName} ${firstName[0]}. ${patronymic[0]}.`;
    },
    openPage(pageName) {
      let i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
      document.getElementById(pageName).style.display = "block";
    },
    getAllDocument() {
      viewDocService.getAllDocuments()
        .then(response => {
          this.documents = response.data;
          //console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    retrieveDocuments() {
      viewInfoDocumentService.getAllInfoDocuments()
        .then(response => {
          //userWorks изменяется
          this.userWorks = response.data;
          //works не изменяется
          this.works = this.userWorks;
          //console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    refreshList() {
      this.retrieveDocuments();
      this.currentWork = null;
      this.currentIndex = -1;
    },
    setActiveDocument(document, index) {
      this.currentWork = document;
      this.done = this.currentWork.painting;
      this.currentIndex = document ? index : -1;
    },
    //показать информацию о поручениях
    showInfo(event, item) {
      this.currentAssign = item;
      const arr = document.querySelector('.list-assignments').querySelectorAll('li');
      //console.log(arr)
      arr.forEach(elem => {
        elem.style.color = 'black'
        elem.style.backgroundColor = 'white';
      });
      event.target.parentElement.parentElement.style.backgroundColor = '#6A5ACD';
      event.target.parentElement.parentElement.style.color = 'white';
    },
    //скачать файл
    download() {
      const fileName = this.currentWork.name_file;
      const url = this.fileInfos.find(elem => elem.name.includes(fileName)).url;
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    //выполнение работы
    perform() {
      try {
        const checked = document.querySelector('#painting-work').checked;
        if (checked === false) throw new Error('Для выполнения работы нужна роспись!');
        if (document.querySelector('#description').value == '') throw new Error('Нужно описание работы!');
        workDocumentService.get(this.currentWork.id_work_document)
          .then(response => {
            this.changedWorkDocument = response.data;
            if (response.statusText == "OK") {
              console.log(response.data);
              this.changedWorkDocument.painting = document.querySelector('#painting-work').checked;
              this.changedWorkDocument.description = document.querySelector('#description').value;
              this.changedWorkDocument.id_status = 4;
              this.changeWorkDocument(this.currentWork.id_work_document, this.changedWorkDocument);
            } else throw new Error('Error');
          })
          .catch(e => {
            console.log(e);
          });
      } catch (err) {
        alert(err.message);
      }
    },
    reject() {
      try {
        if (document.querySelector('#painting-work').checked === false) throw new Error('Для отказа от работы нужна роспись!');
        if (document.querySelector('#description').value == '') throw new Error('Для отказа от работы нужно описание!');
        workDocumentService.get(this.currentWork.id_work_document)
          .then(response => {
            this.changedWorkDocument = response.data;
            if (response.statusText == "OK") {
              console.log(response.data);
              this.changedWorkDocument.painting = document.querySelector('#painting-work').checked;
              this.changedWorkDocument.description = document.querySelector('#description').value;
              this.changedWorkDocument.id_status = 8;
              this.changeRejectDocument(this.currentWork.id_work_document, this.changedWorkDocument);
            } else throw new Error('Error');
          })
          .catch(e => {
            console.log(e);
          });
      } catch (err) {
        alert(err.message);
      }
    },
    changeWorkDocument(id, data) {
      workDocumentService.update(id, data)
        .then(response => {
          if (response.statusText == "OK") {
            console.log(response.data);
            this.retrieveDocuments();
            this.done = this.changedWorkDocument.painting;
            alert('Работа успешно выполнена!');

            setTimeout(() => {
              this.updateDocument(data.id_document);
            }, 1000);

          } else {
            throw new Error('Error');
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeRejectDocument(id, data) {
      workDocumentService.update(id, data)
        .then(response => {
          if (response.statusText == "OK") {
            console.log(response.data);
            this.retrieveDocuments();
            this.done = this.changedWorkDocument.painting;
            alert('Отказ прошел успешно!');

            setTimeout(() => {
              this.updateDocument(data.id_document);
            }, 1000);

          } else {
            throw new Error('Error');
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    goToReassign() {
      this.$router.push('/reassing-work/' + this.currentWork.id_work_document);
    },
    getDocument(id) {
      documentService.get(id)
        .then(response => {
          this.updatedDocument = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateDocument(id) {
      const allWork = [...this.userWorks.filter(elem => elem.id_document === id)];
      let completedWork = [];
      allWork.forEach(elem => {
        if (elem.painting) completedWork.push(elem);
      });
      if (allWork.length === completedWork.length) {
        this.getDocument(id);
        setTimeout(() => {
          this.updatedDocument.is_ready = true;
          console.log(document)
          documentService.update(id, this.updatedDocument).then(response => {
            if (response.statusText == "OK") {
              console.log(response.data);
            } else throw new Error('Error');
          }).catch(e => { console.log(e); });
        }, 1000);
      }
    },
    listEventStatus() {
      statusService.getAllStatus()
        .then((response) => {
          this.listStatus = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveDocuments();
    this.getAllDocument();
    this.listEventStatus();
    uploadService.getFiles().then(response => {
      this.fileInfos = response.data;
      //console.log(response.data)
    });
  }
};
</script>
  
<style scoped>
.list {
  text-align: left;
  margin: auto;
}


.tablink {
  background-color: #555;
  color: white;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  font-size: 17px;
  width: 50%;
}

.tablink:hover {
  background-color: #777;
}

.tabcontent {
  color: white;
  display: none;
  padding: 100px 20px;
  height: 100%;
}

#all-tasks {
  background-color: #E0B589;
  display: block;
}

/*#assignments {
  background-color: #9A8B4F;
}*/

#list-work {
  color: #000;
}

.list-assignments {
  list-style-type: none;
  padding: 0;
  margin-right: 10px;
  width: 620px;
}

.list-assignments li div {
  margin-top: -1px;
  background-color: #f6f6f6;
  padding: 12px;
  color: #000;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.list-assignments li i:hover {
  color: blue;
}

.work-element {
  margin-top: 10px;
  border: 1px solid #000;
  border-radius: 6px;
  padding: 10px;
  flex-direction: column;
}

.work-element input {
  margin-right: 5px;
}

.work-element button {
  margin-top: 5px;
}

#search-assign-work {
  width: 600px;
  margin-bottom: 10px;
}

.horizontal-content {
  display: flex;
  color: #000;
  margin-bottom: -10px;
}

#btn-perform-reject {
  display: flex;
}

#btn-perform-reject button {
  width: 50%;
  margin: 5px;
  margin-top: 10px;
}

.seacrh-string {
  display: flex;
}

.seacrh-string input,
.seacrh-string select {
  width: 266px;
  margin-right: 5px;
}

#explanation {
  width: 400px;
}
</style>