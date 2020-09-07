<template>
  <div>
    <h2>User management</h2>
    <router-link to="/">Home</router-link>
    <hr />
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
      <button id="show-modal" @click="showModal = true">Add new User</button>
      <MyModal
        :posts="posts"
        :id="id"
        :dataUser="dataUser"
        :show-modal="showModal"
        v-if="showModal"
        @close="CancelModal"
        :isEdit="isEdit"
        :addUserModal="addUserModal"
      />
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
      id: null,
      dataUser: {},
      isEdit: false,
    };
  },
  methods: {
    CancelModal(data) {
      this.dataUser = data;
      this.showModal = false;
    },
    addUserModal(id) {
     console.log(id);          
      this.showModal = false;
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
  },
  mounted() {
    fetch(`https://gorest.co.in/public-api/users/?page=${this.page}`)
      .then((response) => response.json())
      .then((json) => {
        let temp = [];
        json.data.forEach(function (el) {
          if (temp.length < 10) {
            temp.push(el);
          }
        });
        this.posts = temp;
        this.pages = json.meta.pagination.pages;
        this.page = json.meta.pagination.page;
      });
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
  width: 500px;
}
</style>
