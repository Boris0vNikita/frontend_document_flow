<template>
  <div class="global-div">
    <div class="table-document">
      <div id="table-header">
        <div class="h-title"><b>Кафедра</b></div>
        <div class="h-title"><b>Вся работа</b></div>
        <div class="h-title"><b>Выполненная</b></div>
        <div class="h-title"><b>В работе</b></div>
      </div>
      <div id="table-body" class="assign-user" v-for="item in sortedWork" v-bind:key="item.id_department">
        <div class="b-completion">{{ item.name_department }}</div>
        <div class="b-completion">{{ item.anyone }}</div>
        <div class="b-completion">{{ item.writing }}</div>
        <div class="b-completion">{{ item.nonwriting }}</div>
      </div>
    </div>
  </div>
  <div id="logotip">
    <a v-show="false" />
    <a>
      <img src="../assets/pngwing.com3.png" className="logo react"/>
    </a>
  </div>
  <!--
  <div class="canvas">
    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../images/123.png" class="d-block w-100" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
      aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>

    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions"
      aria-labelledby="offcanvasWithBothOptionsLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdrop with scrolling</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p>Try scrolling the rest of the page to see this option in action.</p>
      </div>
    </div>
  </div>

  <div class="row canvas">
    <div class="col-4">
      <div id="list-example" class="list-group">
        <a class="list-group-item list-group-item-action" href="#list-item-1">Директор</a>
        <a class="list-group-item list-group-item-action" href="#list-item-2">Исполнитель</a>
        <a class="list-group-item list-group-item-action" href="#list-item-3">Поручитель</a>
      </div>
    </div>
    <div class="col-8">
      <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true"
        class="scrollspy-example bodies" tabindex="0">
        <h4 id="list-item-1">Директор</h4>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <h4 id="list-item-2">Исполнитель</h4>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <h4 id="list-item-3">Поручитель</h4>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
        <p>dfhhhhhhhhhhhhhhhhhhhhhhhhh</p>
      </div>
    </div>
  </div>

  <div class="canvas">
    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
      aria-controls="offcanvasRight">Toggle right offcanvas</button>

    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">Offcanvas right</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        ...
      </div>
    </div>

  </div>
  <div class="window">
    <button type="button" class="btn pink-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>

<script>
import ViewWorkDepartmentService from "../services/view_work_department.service"

export default {
  name: "Home",
  data() {
    return {
      workDepartments: [],
    };
  },
  computed: {
    sortedWork() {
      return this.workDepartments.slice().sort((d1, d2) => (d1.id_department > d2.id_department) ? 1 : -1);
    },
  },
  methods: {
    listEventWorksDepartment() {
      ViewWorkDepartmentService.getAllWorkDepartments()
        .then((response) => {
          this.workDepartments = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.listEventWorksDepartment();
  },

};
</script>

<style scoped>
.window {
  margin-top: 10px;
  margin-left: 10px;
}

.pink-danger {
  background-color: pink;
}

.canvas {
  margin-top: 10px;
  margin-left: 10px;
  margin-top: 10px;
}

.bodies {
  overflow-y: scroll;
  height: 200px;
  width: 500px;
}

.logo {

  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 5s linear;
  }
}

#logotip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
