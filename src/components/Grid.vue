<template>
  <div class="offset">    
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Action</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
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
  methods: {
    editUser(id) {     
      this.$emit("edit-user", (id));                      
    },

    deleteUser(id, name) {
      this.$emit("delete-user", id, name);
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

</style>