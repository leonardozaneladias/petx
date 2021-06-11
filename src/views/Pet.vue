<template>
  <layout>    
    <v-container  :fluid="true">

      <v-dialog
      v-model="loader"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Carregando dados
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  <v-card elevation="2" class="pa-3" v-show="!loader">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-avatar size="140" color="grey" @click="openFile">
          <v-img
            ref="img"
            :src="imageSrc"
            min-width="150"
            min-height="150"
            max-height="150"
            max-width="150"
          ></v-img>
        </v-avatar>
        <input type="file" 
          v-show="false"
          ref="inputFile"
          @change="changeFile" 
        />
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-row>
      <v-col>
        <v-form
          ref="form"
        >
          <v-text-field
            v-model="pet.name"
            label="Nome"
            required
          ></v-text-field>

          <v-select
            v-model="animal_id"
            :items="animals"
            item-text="name"
            item-value="id"
            label="Animal"
            required
            @change="changeAnimal"
          ></v-select>

          <v-select
            v-model="pet.breed_id"
            :items="breeds"
            item-text="name"
            item-value="id"
            label="Raça"
            required
            :loading="selectBreedLoading"
            no-data-text="Selecione o Animal acima!"
          ></v-select>


          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="pet.birth_date"
                label="Nascimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="pet.birth_date"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>

          <v-text-field
            v-model="pet.weight"
            label="Peso"
            required
          ></v-text-field>

          

        </v-form>
      </v-col>
    </v-row>
    </v-card>
        <v-btn
            color="success"
            class="mr-4 mt-4"
            block
            @click="savePet"
            v-show="!loader"
          >
            Salvar
          </v-btn>
        
        <v-btn
            color="error"
            class="mr-4 mt-4"
            block
            @click="dialog = true"
            v-show="!loader"
          >
            Excluir
          </v-btn>
      

  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      
      <v-card>
        <v-card-title class="headline">
          Você deseja realmente excluir este Pet?
        </v-card-title>
        <v-card-text>Essa ação não podera ser desfeita</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deletePet"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';

  export default {
  watch: {
    menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
  },
  props: ['id'],
  methods: {
    toSchedule(pet){
      this.$router.push({name: 'Pet', params: {id: pet.id}});
    },
    changeAnimal(e){
      const animal = this.animals.find((a) => a.id == e);
      console.log(animal);
      if(animal){
        this.breeds = animal.breeds;
      }else{
        this.breeds = [];
      }
    },
    save (date) {
        this.$refs.menu.save(date)
      },
    async savePet(){
      const token = localStorage.getItem('token');

      const res = await axios.put('http://localhost/api/pet/' + this.id, this.pet, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
      console.log(res);  
    },
    openFile(){
      this.$refs.inputFile.click();
    },
    changeFile(e){
      const file = e.target.files[0]
      this.mime_type = file.type;
      const vue = this;
      // console.log(this.mime_type); 
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onloadend = function () {
            // console.log('reader.result', reader.result);
            vue.pet.image = reader.result; 
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    async deletePet(){
      this.loader = true;
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost/api/pet/' + this.id, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(data => {
         
          if(data.status == 204){
            this.$router.push({name: 'MeusPets'});
          }

        }).catch(err => {
          console.log(err)
        })
        this.dialog = false
    }
    
  },
    async mounted(){
        const token = localStorage.getItem('token');

        await axios.get('http://localhost/api/animals', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(data => {
          this.loader = false;
          if(data){
            this.animals = data.data
            
            
          }
        }).catch(err => {
          console.log(err)
        })
        
        await axios.get('http://localhost/api/pet/' + this.id, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(data => {
         
          this.loader = false;
          if(data){
            const animal = this.animals.find( (a) => a.id == data.data.breed.animal_id);
            this.breeds = animal.breeds;
            this.animal_id = animal.id;
            this.pet = data.data;
            this.pet.image = 'http://localhost/storage/uploads/pets/'+this.pet.image;

          }
        }).catch(err => {
          console.log(err)
        })


        
    },
    data: () => ({
      // items: [
      //   { id: 1, title: 'Banho Simples', src: 'https://media.gazetadopovo.com.br/viver-bem/2017/09/dognobanho-0d99ac80.jpg', amount: 30, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.' },
      //   { id: 2, title: 'Banho Completo + Tosa', src: 'https://www.filhodamae.com/img/2017/03/31/fileg_14064.jpg', amount: 50, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      //   { id: 3, title: 'Banho Anti-alérgico', src: 'https://lh3.googleusercontent.com/proxy/oe0mCdgwy2HCWuJ3Xau-jTGuPTAnra80lOaNTRclnLmtnAZBbLBMAfeiMPE8yCeVJIrmjYYTz0Md6MqFFqwcUjtHEmoI8bfYR45mkV-wiQTPNxxK1hJCP52thMMsmKRwFdOX7h5CtcGh43BQiOI', amount: 80, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      // ],
      loader: true,
      pet: {},
      animals: [],
      breeds: [],
      selectBreedLoading: false,
      animal_id: Number,
      dialog: false,

      //
      date: null,
      menu: false,
    }),
    computed: {
      imageSrc() {
          return this.pet.image;
      }
    },
    components: {
      layout
    }
    
  }
</script>