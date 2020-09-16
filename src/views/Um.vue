<template>
  <div>
    <h2>User management</h2>
    <router-link to="/">Home</router-link>
    <hr />
    <input type="text" class="input-search" @change="handlerSearch"/>
    <div class="my-grid">
      <Grid
        :posts="posts"
        :page="page"
        :perPage="perPage"
        :pages="pages"
        :isEdit="isEdit"
        @edit-user="editUser"
        @delete-user="deleteUser"
      />
    </div>
    <div>
      <button class="button-ctrl" id="show-modal" @click="showModal = true">Add new User</button>
      <MyModal
        :posts="posts"
        :id="id"
        :dataUser="dataUser"
        :show-modal="showModal"
        v-if="showModal"
        @close="CancelModal"
        :isEdit="isEdit"
        @add-user="addUserModal"
        @update-user="updateUserModal"
      />
    </div>
    <div class="pagination" @click="onChangePage" :page="page" :pages="pages">
      <button id="first" :disabled="page === 1" class="button-page" type="button">First</button>
      <button id="prev" :disabled="page === 1" class="button-page" type="button">Prev</button>
      <span>{{page}}/{{pages}}</span>
      <button id="next" :disabled="page === pages" class="button-page" type="button">Next</button>
      <button id="last" :disabled="page === pages" class="button-page" type="button">Last</button>
    </div>
  </div>
</template>

<script>
import Grid from "@/components/Grid";
import MyModal from "@/components/MyModal";
export default {
  name: "App",
  components: {
    Grid,
    MyModal,
  },
  data() {
    return {
      posts: [],
      page: 1,
      perPage: 9,
      pages: null,
      showModal: false,
      id: "",
      dataUser: {},
      isEdit: false,
    };
  },
  methods: {
    handlerSearch() {
      this.posts.find((el) => {        
         let temp = el.name.toLowerCase().includes(event.target.value.toLowerCase());
         console.log(temp);
      })   
    },
    onChangePage() {
      switch (event.target.id) {
        case "first":
          this.page = 1;
          break;
        case "prev":
          this.page--;
          break;
        case "next":
          this.page++;
          break;
        case "last":
          this.page = this.pages;
          break;
        default:
          alert("No such values");
      }
      this.loadDataFromApi(this.page);
      //console.log(this.page);
    },
    CancelModal(data) {
      this.dataUser = data;
      this.showModal = false;
    },
    addUserModal(data) {     
      this.posts.push(data);
    },
    updateUserModal(data) {
      let index = this.posts.findIndex((e) => data.id === e.id);
      this.posts.splice(index, 1, data);
    },
    editUser(id) {
      this.isEdit = true;
      this.posts.forEach((el) => {
        if (el.id === id) {
          this.dataUser.id = el.id;
          this.dataUser.name = el.name.split(" ")[0];
          this.dataUser.surname = el.name.split(" ")[1];
          this.dataUser.email = el.email;
        }
      });
      this.showModal = true;
    },
    deleteUser(id, name) {
      const apiUrl = `https://gorest.co.in/public-api/users/${id}`;
      this.goodRes = [];
      this.errors = [];
      fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 97475bbe90f2cfd562be4dd5f99b210b66e45ef004995b5312d7a8c390a15bca",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          let goodResponce = await res.json();
          this.goodRes.push(goodResponce.text);
          alert(`User ${name} id=${id} was delete successfully.`);
          this.posts = this.posts.filter((t) => t.id !== id);
        } else {
          let errorResponse = await res.json();
          this.errors.push(errorResponse.error);
          console.log(errorResponse);
        }
      });
    },
    loadDataFromApi(curPage) {
      fetch(`https://gorest.co.in/public-api/users?page=${curPage}`)
        .then((response) => response.json())
        .then((json) => {
          let temp = [];
          json.data.forEach(function (el) {
            if (temp.length < 10) {
              temp.push(el);
            }
          });
          this.posts = temp;
          this.page = json.meta.pagination.page;
          this.pages = json.meta.pagination.pages;          
        });
    },
  },
  mounted() {
    this.loadDataFromApi(this.page);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.input-search {
  width: 1000px;
}
.button-ctrl {
  background-color: SteelBlue;
  color: white;

}
.pagination {
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.button-page {
  border-color: lightgrey;
  border-width: 1px;
  margin: 0 5px;
  width: 60px;
}
span {
  margin: 0 5px;
}
</style>
