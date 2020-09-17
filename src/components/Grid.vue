<template>
  <div class="offset">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Action</th>
          <!-- <th>Name</th>
          <th>Surname</th>
          <th>Email</th>-->
          <th v-for="(column, index) in columns" :key="index">
            <a href="#" @click="sortBy(column)">{{ column }}</a>
          </th>
          <th>Create/update date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, ind) in posts" :key="ind">
          <td class="td-action">
            <button type="button" class="update-user" @click="$emit('edit-user', post.id)">Edit</button>
            <button
              type="button"
              class="delete-user"
              @click="$emit('delete-user', post.id, post.name)"
            >Delete</button>
          </td>
          <td>{{post.name.split(' ')[0]}}</td>
          <td>{{post.name.split(' ')[1]}}</td>
          <td>{{post.email}}</td>
          <td>
            {{new Date(post.updated_at).getDate()}}.{{new Date(post.updated_at).getMonth() + 1}}.{{new Date(post.updated_at).getFullYear()}}
            {{new Date(post.updated_at).getHours()}}:{{new Date(post.updated_at).getMinutes()}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Grid",
  props: ["posts", "isEdit"],
  data() {
    return {
      search: "",
      columns: ["name", "surname", "email"],
    };
  },
  methods: {
    editUser(id) {     
      this.$emit("edit-user", id);
    },

    deleteUser(id, name) {
      this.$emit("delete-user", id, name);
    },
    sortBy(sortKey) {
      if (sortKey === "surname") {
        this.posts.sort((a, b) => {
          let val1 = a.name.substring(a.name.indexOf(" ") + 1);
          let val2 = b.name.substring(b.name.indexOf(" ") + 1);
          if (val1 > val2) {
            return 1
          } else {
            return -1
          }
        });
      } else {
        this.posts.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
      }
    },
  },
};
</script>

<style scoped>
button.page-link {
  display: inline-block;
}
button.page-link {
  font-size: 20px;
  color: #29b3ed;
  font-weight: 500;
}
.offset {
  width: 1000px !important;
  margin: 20px auto;
}
form {
  display: flex;
}
.td-action {
  width: 185px;
}
button.update-user {
  width: 70px;
  height: 25px;
  border-color: cornflowerblue;
  float: left;
  border-radius: 5px;
}

button.delete-user {
  width: 70px;
  height: 25px;
  margin-left: 15px;
  border-color: IndianRed;
  float: left;
  border-radius: 5px;
}
a {
  font-weight: bold;
  text-decoration: none;
  text-transform: capitalize;
}
.active {
  font-weight: bold;
  color: black;
  text-decoration: underline;
}
</style>