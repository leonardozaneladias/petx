<template>
  <layout>    
    <v-container  :fluid="true">

      

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
                label="Birthday date"
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

          <v-btn
            color="success"
            class="mr-4"
            @click="savePet"
          >
            Salvar
          </v-btn>

        </v-form>
      </v-col>
    </v-row>

    

              
  
  
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

      const res = await axios.post('http://localhost/api/pet', this.pet, {
          headers: {
            Authorization: 'Bearer ' + token 
          }
        }); 
        console.log(res);
      if(res.statusText === "Created"){
          this.$router.push({name: 'MeusPets'});
      }  
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
        



        
    },
    data: () => ({
      // items: [
      //   { id: 1, title: 'Banho Simples', src: 'https://media.gazetadopovo.com.br/viver-bem/2017/09/dognobanho-0d99ac80.jpg', amount: 30, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.' },
      //   { id: 2, title: 'Banho Completo + Tosa', src: 'https://www.filhodamae.com/img/2017/03/31/fileg_14064.jpg', amount: 50, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      //   { id: 3, title: 'Banho Anti-alérgico', src: 'https://lh3.googleusercontent.com/proxy/oe0mCdgwy2HCWuJ3Xau-jTGuPTAnra80lOaNTRclnLmtnAZBbLBMAfeiMPE8yCeVJIrmjYYTz0Md6MqFFqwcUjtHEmoI8bfYR45mkV-wiQTPNxxK1hJCP52thMMsmKRwFdOX7h5CtcGh43BQiOI', amount: 80, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      // ],
      loader: true,
      pet: {
        name: '',
        breed_id: '',
        birth_date: '',
        weight: '',
        image: ''
      },
      animals: [],
      breeds: [],
      selectBreedLoading: false,
      animal_id: Number,
      myImage: '',

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
    },
    
  }
</script>