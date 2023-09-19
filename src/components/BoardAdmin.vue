<template>
  <div id="add-data">
    <div class="tab">
      <button class="tablinks" @click="openCity('status-add')">Статус</button>
      <button class="tablinks" @click="openCity('type-add')">Тип документа</button>
    </div>

    <div id="status-add" class="tabcontent">
      <div id="status-list-add">
        <div>
          <h1 class="glow">Список всех статусов</h1>
          <ul id="status-list">
            <li v-for="item in  sortedListStatus" :key="item.id_status">
              <div>
                <b>{{ item.name_status }}</b>
                <i @click="changeStatus(item)" id="change-icon" class="bi bi-pencil-fill"></i>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div id="submitted" class="add-element">
            <div class="form-group">
              <label>Наименование статуса</label>
              <input type="text" class="form-control" v-model="nameStatus">
            </div>
            <button @click="saveStatus()" class="btn btn-dark">Добавить новый статус</button>
          </div>
          <div id="submitted" class="change-element-status">
            <div class="form-group">
              <div>
                <label>Изменение статуса</label>
                <span @click="closeWindow($event)" id="sp-close-status">закрыть окно изменения</span>
              </div>
              <input type="text" class="form-control" v-model="newStatus">
            </div>
            <button @click="updateStatus()" class="btn btn-dark">Изменить</button>
          </div>
        </div>
      </div>
    </div>

    <div id="type-add" class="tabcontent">
      <div id="type-list-add">
        <div>
          <h1 class="glow">Список всех типов</h1>
          <ul id="type-list">
            <li v-for="item in  sortedListType" :key="item.id_type_document">
              <div>
                <b>{{ item.name_type }}</b>
                <i @click="changeType(item)" id="change-icon" class="bi bi-pencil-fill"></i>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div id="submitted" class="add-element">
            <div class="form-group">
              <label>Наименование статуса</label>
              <input type="text" class="form-control" v-model="nameType">
            </div>
            <button @click="saveType()" class="btn btn-dark">Добавить новый тип</button>
          </div>
          <div id="submitted" class="change-element-type">
            <div class="form-group">
              <div>
                <label>Изменение типа</label>
                <span @click="closeWindow($event)" id="sp-close-type">закрыть окно изменения</span>
              </div>
              <input type="text" class="form-control" v-model="newType">
            </div>
            <button @click="updateType()" class="btn btn-dark">Изменить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import statusService from "../services/status.service";
import typeService from "../services/type_document.service";

export default {
  name: "Admin",
  data() {
    return {
      statusList: [],
      nameStatus: '',
      newStatus: '',
      changedStatus: {
        id_status: null,
        name_status: '',
      },
      typeList: [],
      nameType: '',
      newType: '',
      changedType: {
        id_type_document: null,
        name_type: '',
      },
    };
  },
  computed: {
    sortedListStatus() {
      return this.statusList.slice().sort((d1, d2) => (d1.id_status > d2.id_status) ? 1 : -1);
    },
    sortedListType() {
      return this.typeList.slice().sort((d1, d2) => (d1.id_type_document > d2.id_type_document) ? 1 : -1);
    },
  },
  methods: {
    //работа с tabs
    openCity(cityName) {
      let i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
      }
      document.getElementById(cityName).style.display = "block";
    },
    //работа со статусом
    listEventStatus() {
      statusService.getAllStatus()
        .then((response) => {
          this.statusList = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    saveStatus() {
      try {
        if (this.nameStatus == '') throw new Error('Название статуса не введено!');
        const newName = this.statusList.find(elem => elem.name_status == this.nameStatus);
        if (newName) throw new Error('Статус с таким наименованием уже есть!');
        const newStatus = {
          id_status: this.sortedListStatus[this.sortedListStatus.length - 1].id_status + 1,
          name_status: this.nameStatus,
        };
        statusService.create(newStatus)
          .then(response => {
            if (response.statusText == "OK") {
              this.listEventStatus();
              alert('Новый статус успешно добавлен!');
              console.log(response.data);
            } else {
              throw new Error('Error');
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
    changeStatus(item) {
      this.changedStatus = item;
      this.newStatus = item.name_status;
      document.querySelector('.change-element-status').style.visibility = 'visible';
    },
    updateStatus() {
      try {
        if (this.newStatus == '') throw new Error('Новое название статуса не введено!');
        this.changedStatus.name_status = this.newStatus;
        statusService.update(this.changedStatus.id_status, this.changedStatus)
          .then(response => {
            if (response.statusText == "OK") {
              this.listEventStatus();
              console.log(response.data);
              alert('Наименование статуса успешно обновлено!');
              document.querySelector('.change-element-status').style.visibility = 'hidden';
            } else {
              throw new Error('Error');
            }
          })
          .catch(e => {
            console.log(e);
          });
      } catch (err) {
        alert(err.message);
      }
    },
    //работа с типом документа
    listEventType() {
      typeService.getAllType()
        .then((response) => {
          this.typeList = response.data;
          //console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    saveType() {
      try {
        if (this.nameType == '') throw new Error('Название типа документа не введено!');
        const newName = this.typeList.find(elem => elem.name_type == this.nameType);
        if (newName) throw new Error('Тип документа с таким наименованием уже есть!');
        const newType = {
          id_type_document: this.sortedListType[this.sortedListType.length - 1].id_type_document + 1,
          name_type: this.nameType,
        };
        typeService.create(newType)
          .then(response => {
            if (response.statusText == "OK") {
              this.listEventType();
              alert('Новый тип документа успешно добавлен!');
              console.log(response.data);
            } else {
              throw new Error('Error');
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
    changeType(item) {
      this.changedType = item;
      this.newType = item.name_type;
      document.querySelector('.change-element-type').style.visibility = 'visible';
    },
    updateType() {
      try {
        if (this.newType == '') throw new Error('Новое название типа документа не введено!');
        this.changedType.name_type = this.newType;
        typeService.update(this.changedType.id_type_document, this.changedType)
          .then(response => {
            if (response.statusText == "OK") {
              this.listEventType();
              console.log(response.data);
              alert('Наименование типа документа успешно обновлено!');
              document.querySelector('.change-element-type').style.visibility = 'hidden';
            } else {
              throw new Error('Error');
            }
          })
          .catch(e => {
            console.log(e);
          });
      } catch (err) {
        alert(err.message);
      }
    },
    closeWindow(event) {
      const id = event.target.id;
      if (id == 'sp-close-type') {
        document.querySelector('.change-element-type').style.visibility = 'hidden';
        this.changedType = {
          id_type_document: null,
          name_type: '',
        };
      } else if (id == 'sp-close-status') {
        document.querySelector('.change-element-status').style.visibility = 'hidden';
        this.changedStatus = {
          id_status: null,
          name_status: '',
        };
      }
    }
  },
  mounted() {
    this.listEventStatus();
    this.listEventType();
  },
};
</script>

<style scoped>
/* Style the tab */
.tab {
  float: left;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  width: 20%;
  height: 100%;
}

/* Style the buttons inside the tab */
.tab button {
  display: block;
  background-color: inherit;
  color: black;
  padding: 22px 16px;
  width: 100%;
  border: none;
  outline: none;
  text-align: left;
  cursor: pointer;
  transition: 0.3s;
  font-size: 17px;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current "tab button" class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  float: left;
  padding: 0px 12px;
  border: 1px solid #ccc;
  width: 80%;
  border-left: none;
  height: 100%;
  display: none;
  background: #edd4ff;
}

#status-list-add,
#type-list-add {
  margin: 1rem;
  display: flex;
}

#status-list,
#type-list {
  list-style-type: none;
  /* Remove bullets */
  padding: 0;
  /* Remove padding */
  margin-right: 40px;
  /* Remove margins */
}

#status-list li,
#type-list li {
  margin: 5px;
  border: 1px solid #ddd;
  /* Add a thin border to each list item */
  margin-top: -1px;
  /* Prevent double borders */
  background-color: #f6f6f6;
  /* Add a grey background color */
  padding: 12px;
  /* Add some padding */
  border-radius: 20px;
}

.add-element,
.change-element-status,
.change-element-type {
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 20px;
  margin-top: 30px;
}

.change-element-status,
.change-element-type {
  visibility: hidden;
}

.glow {
  font-size: 24px;
  color: #fff;
  text-align: center;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #7a04eb, 0 0 40px #7a04eb, 0 0 50px #7a04eb, 0 0 60px #7a04eb, 0 0 70px #7a04eb;
  }

  to {
    text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #1afe49, 0 0 80px #1afe49;
  }
}

#sp-close-type,
#sp-close-status {
  font-size: 12px;
  margin-left: 10px;
  text-decoration: underline;
}

#sp-close-type:hover,
#sp-close-status:hover {
  color: gray;
}
</style>