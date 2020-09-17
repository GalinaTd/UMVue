<template>
  <div id="modal-template">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <a href="#" class="close" @click="CancelModal">×</a>
            <div class="modal-header">
              <slot name="header">
                <h3>Card user</h3>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <form @submit="checkForm" method="post" novalidate="true" id="my-modal">
                  <div class="errors" v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                      <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                  </div>
                  <div class="form-group">
                    <label for="name">Enter your Name:</label>
                    <input id="name" type="text" size="60" name="name" v-model="dataEditUser.name" />
                  </div>
                  <div class="form-group">
                    <label for="surname">Enter your Surname:</label>
                    <input
                      id="surname"
                      type="text"
                      size="60"
                      v-model="dataEditUser.surname"
                      name="surname"
                    />
                  </div>
                  <div class="form-group">
                    <label for="date">Enter your date of birthday:</label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      v-model="dataEditUser.date"
                      min="1965-01-29"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Enter your phone number:</label>
                    <input
                      type="tel"
                      id="phone"
                      v-model="dataEditUser.phone"
                      name="phone"
                      pattern="0[0-9]{2}-[0-9]{7}"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="email">Enter your Email:</label>
                    <input id="email" type="email" name="email" v-model="dataEditUser.email" />
                  </div>
                  <hr />
                  <div class="form-buttons">
                    <button type="submit" class="modal-button border-color-save">Save</button>
                    <button class="modal-button border-color-cancel" @click="CancelModal">Cancel</button>
                  </div>
                </form>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MyModal",
  props: ["showModal", "id", "dataUser", "isEdit", "posts"],
  data() {
    return {
      errors: [],
      dataEditUser: { ...this.dataUser },
      dataUsers: { ...[this.posts] },
    };
  },
  methods: {
    CancelModal() {  
      this.cleanFieldsModal();                
      this.$emit("close", true);//this.dataEditUser
    },

    cleanFieldsModal() {
      //console.log(this.dataEditUser);
      this.dataEditUser.id = "";
      this.dataEditUser.name = "";
      this.dataEditUser.surname = "";
      this.dataEditUser.date = "";
      this.dataEditUser.phone = "";
      this.dataEditUser.email = "";      
    },
    checkForm(e) {
      e.preventDefault();
      this.errors = [];
      //add new user
      if (!this.isEdit) {
        this.dataEditUser.name = e.target.name.value;
        this.dataEditUser.surname = e.target.surname.value;
        this.dataEditUser.date = e.target.date.value;
        this.dataEditUser.phone = e.target.phone.value;
        this.dataEditUser.email = e.target.email.value;       
      }
        
      //check
      if (!this.dataEditUser.name) this.errors.push("Name required.");
      if (!this.dataEditUser.surname) this.errors.push("Surname required.");
      if (!this.dataEditUser.date)
        this.errors.push("Date of birthday required.");
      if (!this.dataEditUser.email) {
        this.errors.push("Email required.");
      } else if (!this.validEmail(this.dataEditUser.email)) {
        this.errors.push("Valid email required.");
      }
      //start add or update user
      if (!this.errors.length) {
        const data = {
          name: `${this.ucFirst(this.dataEditUser.name.trim())} ${this.ucFirst(
            this.dataEditUser.surname.trim()
          )}`,
          date: this.dataEditUser.date,
          gender: "Female",
          phone: this.dataEditUser.phone,
          email: this.dataEditUser.email,
          status: "Active",
        };
        if (!this.isEdit) {
          this.addNewUserApi(data);
        } else {
          this.updateUserApi(this.dataEditUser.id, data);
        }
      }
    },
    validEmail(email) {
      /* eslint-disable */
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      /* eslint-enable */
      return re.test(email);
    },
    async addNewUserApi(data) {
      const apiUrl = "https://gorest.co.in/public-api/users";
      this.goodRes = [];
      fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 97475bbe90f2cfd562be4dd5f99b210b66e45ef004995b5312d7a8c390a15bca",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          let goodResponce = await res.json();
          this.goodRes.push(goodResponce.text);
          alert(
            `User ${goodResponce.data.name} (id=${goodResponce.data.id}) was create successfully.`
          );
          this.addUserModal(goodResponce.data);
          this.CancelModal();                    
        } else {
          let errorResponse = await res.json();
          this.errors.push(errorResponse.error);
          console.log(errorResponse);
        }
      });
    },
    //capitalize the first letter
    ucFirst(str) {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    },
    //update user API
    async updateUserApi(id, data) {
      const apiUrl = `https://gorest.co.in/public-api/users/${id}`;
      this.goodRes = [];
      fetch(apiUrl, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 97475bbe90f2cfd562be4dd5f99b210b66e45ef004995b5312d7a8c390a15bca",
        },
      }).then(async (res) => {
        if (res.status === 200) {
          let goodResponce = await res.json();
          this.goodRes.push(goodResponce.text);
          alert(
            `User ${goodResponce.data.name} (id=${goodResponce.data.id}) was corrected successfully.`
          );
          //this.$emit("close", true);
          this.updateUserModal(goodResponce.data);
          this.CancelModal();
          //this.cleanFieldsModal();          
          //this.isEdit = false;
        } else {
          let errorResponse = await res.json();
          this.errors.push(errorResponse.error);
          console.log(errorResponse);
        }
      });
    },
    addUserModal(data) {     
      this.$emit("add-user", data);
    },
    updateUserModal(data) {
      this.$emit("update-user", data);     
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 700px;
  height: 750px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: black;
}

.modal-body {
  margin: 20px 0;
}

.modal-button {
  width: 130px;
  margin: 30px;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.close {
  float: right;
  font-family: sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  text-decoration: none;
}
.close:focus,
.close:hover {
  color: #000;
  text-decoration: none;
  cursor: pointer;
  opacity: 0.75;
}
.form-group {
  margin-top: 10px;
  display: table;
  height: 40px;
}
label {
  margin-top: 20px;
  width: 220px;
  float: left;
  text-align: left;
}
input {
  margin-top: 0px;
  width: 300px;
  float: left;
}
.border-color-save {
  border-color: cornflowerblue;
}
.border-color-cancel {
  border-color: IndianRed;
}
</style>