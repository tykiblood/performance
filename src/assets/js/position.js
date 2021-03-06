import AlertModal from '../../components/AlertModal'
import Toolbar from '../../components/Toolbar'
import AppNav from '../../components/AppNav'
import Multiselect from 'vue-multiselect'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { getAccessToken, getIdToken, isLoggedIn } from '../../../utils/auth'
import { required } from 'vuelidate/lib/validators'
import Datepicker from 'vuejs-datepicker'
import axios from 'axios'

export default {
  components: {
    AppNav,
    Multiselect,
    VueGoogleAutocomplete,
    Toolbar,
    Datepicker,
    AlertModal
  },
  data: function () {
    return {
      schema: {
        name: '',
        description: '',
        work_team_description: '',
        candidate_characteristics: '',
        expiration_date: '',
        filters: [],
      },
      errors: {
        name: false,
        name_label: '',
        expiration_date: false,
        expiration_date_label: '',
        expiration_date_color: '',
        description: false,
        description_label: '',
        filters: false,
        filters_label: ''
      },
      dirty: {
        name: false,
        expiration_date: false
      },
      shareUrl: null,
      google_api_plugin: null,
      id: null,
      name: '',
      status: 'unpublished',
      new_department: '',
      department_list: [],
      skills_list: [],
      department: '',
      skills_info: '',
      skills: '',
      departments: [],
      department_update: '',
      position_type_id: '',
      city: [],
      description_length: 0,
      description_valid: true,
      description_empty: true,
      description_max_characters: 10000,
      work_team_description_empty: true,
      candidate_characteristics_empty: true,
      questions: '',
      preformulated_questions: '',
      disabled: {
        to: new Date()
      },
      is_valid_expiration_date: false,

      position_id: this.$route.params.position_id,
      position: {},
      filters_education_level: [],
      filters_experience_years: [],
      filters_technical_skill: [],
      filters_business_skill: [],
      filters_to_remove: [],
      education_level: '',
      experience_years_min: '',
      experience_years_max: '',
      technical_skill: '',
      business_skill: '',
      value: '',
      type: 'education_level',
      importance: -1,
      radioValue: 1,
      valid: true,
      valid_asign: false,
      bootstrap_min_js: null,
      scrollmagic: null,
      showAlert: true,
      typeOfAlert: '',
      typeMessage: '',
      alertMessage: '',
      successSave: 'La posición se almacenó correctamente.',
      successPublish: 'La posición ha sido publicada correctamente.',
      dataJson: {}
    }
  },
  schema: [
    function loadSchemaOnCreate() {
      let schemaDataPromise = new Promise((resolve, reject) => {
        axios.get('/schemas/position.json')
        .then(response => {
          resolve(response.data)
        })
      });
      return schemaDataPromise
    }
  ],
  computed: {
    strippedDescription () {
      if (this.schema.description !== null) {
          return this.stripTags(this.schema.description)
      }
    },
    facebookQuote () {
      if (this.schema.description !== null) {
        return this.schema.name + '  -  ' + this.stripTags(this.schema.description)
      }
    }
  },
  methods: {
    reset () {
      this.errors.name = false
    },
    showErrorsLabel (v) {
      var inputKeys = Object.keys(this.schema)
      for (var i = 0; i < inputKeys.length; i++) {
        this.showErrorLabel(v, inputKeys[i])
      }
      this.specialErrorLabels()
    },
    showErrorLabel (v, input) {
      this.errors[input] = v[input].$error
      this.dirty[input] = v[input].$dirty
      if (this.errors[input]) {
        var listOfErrors = Object.keys(v[input].$params)
        for (var i = 0; i < listOfErrors.length; i++) {
          if (!v[input][listOfErrors[i]]) {
            this.errors[input + '_label'] = v[input].$params[listOfErrors[i]].schema.errorMessage[listOfErrors[i]]
          }
        }
      }
    },
    specialErrorLabels () {
      if (this.errors.expiration_date_label !== '') {
        this.errors.expiration_date_color = 'red'
      } else {
        this.errors.expiration_date_color = 'black'
      }
    },
    getDescriptionLength ({editor, html, text}) {
      this.description_length = html.length
      this.description_valid = this.description_length < this.description_max_characters
    },
    stripTags (text) {
      let regex = /(<([^>]+)>)/ig
      return text.replace(regex, '')
    },
    isLoggedIn () {
      return isLoggedIn()
    },
    data () {
      return {
        showCollapse: true
      }
    },
    preview (v) {
      this.save(v)
      window.location.href = '/position-preview/' + this.id
    },
    exit () {
      window.location.href = '/positions'
    },
    onChange () {
    },
    remove_city (index) {
      this.city.splice(index, 1)
    },
    remove_department (index) {
      this.new_departments.splice(index, 1)
    },
    add_department (newTag) {
      if (this.department === '') {
        this.department = []
      }
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.department_list.push(tag)
      this.department = tag
    },
    add_skills () {
      this.skills = this.skills_info.name
      var existingSkill = false
      for (var i = 0; i < this.filters_business_skill.length; i++) {
        if (this.filters_business_skill[i]['value'] === this.skills) {
          existingSkill = true
          break
        }
      }
      if (this.skills !== undefined && !existingSkill && this.filters_business_skill.length < 6) {
        this.filters_business_skill.push({
          importance: 0,
          position_id: this.id,
          type_filter: 'business_skill',
          value: this.skills
        })
        this.business_skill = ''
      } else {
        if (!(this.skills !== undefined)) {
          this.show_error('Seleccione una habilidad primero.')
          this.show_error_skills('Seleccione una habilidad primero.')
        }
        if (existingSkill) {
          this.show_error('La habilidad ' + this.skills + ' ya esta en la lista de habilidades.')
          this.show_error_skills('La habilidad ' + this.skills + ' ya esta en la lista de habilidades.')
        }
        if (this.filters_business_skill.length >= 6) {
          this.show_error('No puede agregar mas habilidades')
          this.show_error_skills('No puede agregar mas habilidades')
        }
      }
    },
    remove_skill (index, id) {
      if (id !== undefined) {
        this.filters_to_remove.push(id)
      }
      this.filters_business_skill.splice(index, 1)
    },
    getAddressData: function (addressData, placeResultData) {
      addressData.position_city = ''
      if (addressData.locality !== undefined) {
        addressData.position_city += addressData.locality + ', '
      }
      if (addressData.administrative_area_level_1 !== undefined) {
        addressData.position_city += addressData.administrative_area_level_1 + ', '
      }

      addressData.position_city += addressData.country
      if (addressData.position_city !== '' && addressData.position_city !== null) {
        this.city = [addressData.position_city]
      }
      document.getElementById('cities').value = null
    },
    save (v) {
      this.hide_alerts()
      if (this.id !== undefined && this.id !== null) {
        this.put(v, 'send-button', 'Guardar')
      } else {
        this.post(v)
      }
    },
    get_departments () {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
      this.axios.get('/departments/' + localStorage['company_id'])
      .then((response) => {
        this.department_list = response.data.data.departments
      })
      .catch(error => {
        console.log(error)
      })
    },
    get_skills () {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
      this.axios.get('/skills')
      .then((response) => {
        this.skills_list = response.data.data.skills
      })
    },
    valid_form (v) {
      return !v.$error && this.errors.expiration_date && this.valid
    },
    put (v, button, button_message) {
      if (this.schema.name === ' ') { this.schema.name = '' }
      v.$touch()
      this.showErrorsLabel(v)
      this.errors.expiration_date = this.validate_expiration_date()
      if (this.valid_form(v)) {
        this.show_waiting(button, 'Guardando...')
        this.schema.filters = this.filters_education_level.concat(this.filters_experience_years).concat(this.filters_business_skill).concat(this.filters_technical_skill)
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
        this.axios.put('/position/' + this.id, {
          'name': this.schema.name,
          'company_id': localStorage['company_id'],
          'department': this.department.name,
          'description': this.schema.description,
          'city': this.city,
          'work_team_description': this.schema.work_team_description,
          'candidate_characteristics': this.schema.candidate_characteristics,
          'expiration_date': this.schema.expiration_date,
          'filters': JSON.stringify(this.schema.filters),
          'filters_to_remove': JSON.stringify(this.filters_to_remove)
        })
        .then(response => {
          this.filters_to_remove = []
          this.show_success(button, button_message, this.successSave, 'put')
        })
        .catch(error => {
          console.log(error)
          this.show_error(error.response)
          this.restoreButton(button, oldMsg)
        })
      } else {
        this.show_errors()
      }
    },
    set_status_position (status, v) {
      this.put(v, 'publish', 'Publicar')
      this.show_waiting(status, 'Publicando...')
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
      this.axios.post('/position/' + this.id + '/' + status)
      .then(response => {
        this.show_success(status, 'Publicar', this.successPublish, 'publish')
        this.getPosition()
      })
      .catch(error => {
        this.publish_problem = true
        console.log(error)
      })
    },
    post (v) {
      if (this.schema.name === ' ') { this.schema.name = '' }
      v.$touch()
      this.showErrorsLabel(v)
      this.errors.expiration_date = this.validate_expiration_date()
      if (this.valid_form(v)) {
        var oldMsg = document.getElementById('send-button').innerHTML
        this.show_waiting('send-button', 'Guardando...')
        document.getElementById('send-button').disabled = true
        this.departments = []
        for (var item in this.department) {
          this.departments.push(this.department[item].name)
        }
        this.schema.filters = this.filters_education_level.concat(this.filters_experience_years).concat(this.filters_business_skill).concat(this.filters_technical_skill)
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
        this.axios.post('/position', {
          'company_id': localStorage['company_id'],
          'name': this.schema.name,
          'description': this.schema.description,
          'department': JSON.stringify([this.department.name]),
          'city': JSON.stringify(this.city),
          'work_team_description': this.schema.work_team_description,
          'candidate_characteristics': this.schema.candidate_characteristics,
          'expiration_date': this.schema.expiration_date,
          'filters': JSON.stringify(this.schema.filters )
        })
        .then(response => {
          this.$route.query.id = response.data.data.id
          this.id = this.$route.query.id
          this.show_success('send-button', 'Guardar', this.successSave, 'post')
          this.getPosition()
        })
        .catch(error => {
          console.log(error)
          this.show_error(error.response)
          this.restoreButton('send-button', oldMsg)
        })
      } else {
        this.show_errors()
      }
    },
    show_errors () {
      if (this.schema.expiration_date === '') {
        document.getElementById('date').style.color = 'red'
      }
      if (this.schema.name === '') {
        this.schema.name = ' '
        document.getElementById('name_label').parentElement.classList.add('is-invalid')
      }
      var subValidationYears = !this.valid_years(document.getElementById('info04').value) && this.valid_asign
      var subValidationDescription = !this.description_valid
      if (subValidationYears) {
        this.show_error('Digite un valor valido de años entre 0 y 50')
      }
      if (this.errors.description_label !== '') {
        this.show_error(this.errors.description_label)
      }
      if (subValidationYears && subValidationDescription) {
        this.show_error('Por favor diligencie todos los campos requeridos (*)')
      }
    },
    show_error_skills (msg) {
      this.showAlert = !this.showAlert
      this.typeOfAlert = 'is-error'
      this.typeMessage = 'Error:'
      this.alertMessage = msg
    },
    show_error (msg) {
      this.showAlert = !this.showAlert
      this.typeOfAlert = 'is-error'
      this.typeMessage = 'Error:'
      this.alertMessage = msg
    },
    show_waiting (id, msg) {
      document.getElementById(id).innerHTML = msg
      document.getElementById(id).style.color = 'white'
      document.getElementById(id).disabled = true
    },
    restoreButton (id, msg) {
      document.getElementById(id).innerHTML = msg
      document.getElementById(id).disabled = false
    },
    show_success (id, buttonMessage, alertMessage, type) {
      this.restoreButton(id, buttonMessage)
      this.showAlert = !this.showAlert
      this.typeOfAlert = 'is-success'
      this.typeMessage = 'Proceso Finalizado:'
      this.alertMessage = alertMessage
      if (type === 'post') {
        var newurl = window.location.href + '?id=' + this.id
        window.history.pushState({ path: newurl }, '', newurl)
      }
    },
    hide_alerts () {
      document.getElementById('create-form-container').style.paddingTop = '30px'
      document.getElementById('alert-error').style.display = 'none'
      document.getElementById('alert-success').style.display = 'none'
    },
    validate_expiration_date () {
      if (this.schema.expiration_date === '') {
        document.getElementById('expiration_date').parentElement.parentElement.parentElement.className = 'form-group has-error'
        return false
      } else {
        document.getElementById('expiration_date').parentElement.parentElement.parentElement.className = 'form-group'
        return true
      }
    },
    set_value () {
      switch (this.type) {
        case 'education_level':
          this.value = this.education_level
          break
        case 'experience_years':
          this.value = this.experience_years_min
          break
        case 'technical_skill':
          this.value = this.technical_skill
          break
        case 'business_skill':
          this.value = this.business_skill
          break
      }
      this.post()
    },
    get_type (type) {
      switch (type) {
        case 'education_level':
          return 'Nivel Educativo'
        case 'experience_years':
          return 'Experiencia en años'
        case 'technical_skill':
          return 'Habilidad Ténica'
        case 'business_skill':
          return 'Habilidad de Negocios'
      }
    },
    get_importance (importance) {
      switch (importance) {
        case 0:
          return 'Baja'
        case 1:
          return 'Media'
        case 2:
          return 'Alta'
      }
    },
    get_filters (iid) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
      this.axios.get('/position/' + this.$route.query.id + '/filter')
      .then((response) => {
        this.filters_education_level = []
        this.filters_experience_years = []
        this.filters_technical_skill = []
        this.filters_business_skill = []
        for (var item in response.data.data.filters) {
          switch (response.data.data.filters[item].type_filter) {
            case 'education_level':
              this.filters_education_level.push(response.data.data.filters[item])
              break
            case 'experience_years':
              this.filters_experience_years.push(response.data.data.filters[item])
              break
            case 'technical_skill':
              this.filters_technical_skill.push(response.data.data.filters[item])
              break
            case 'business_skill':
              this.filters_business_skill.push(response.data.data.filters[item])
              break
          }
        }
      })
      .catch(error => { console.log(error) })
    },
    add_technical_skill () {
      this.filters_technical_skill.push({
        importance: 0,
        position_id: this.id,
        type_filter: 'technical_skill',
        value: this.technical_skill
      })
      this.technical_skill = ''
    },
    add_business_skill () {
      this.filters_business_skill.push({
        importance: 0,
        position_id: this.id,
        type_filter: 'business_skill',
        value: this.business_skill
      })
      this.business_skill = ''
    },
    add_education_level () {
      this.filters_education_level.push({
        importance: 0,
        position_id: this.id,
        type_filter: 'education_level',
        value: this.education_level
      })
      this.education_level = ''
    },
    add_experience_years () {
      if (this.valid_years(document.getElementById('info04').value)) {
        this.filters_experience_years.push({
          importance: 0,
          position_id: this.id,
          type_filter: 'experience_years',
          value: this.experience_years_min
        })
        this.experience_years = ''
        this.hide_alerts()
      } else {
        document.getElementById('years_label').parentElement.classList.add('is-invalid')
        this.show_error('Digite un valor valido de años entre 0 y 50')
      }
    },
    valid_years (y) {
      return (y >= 0 && y <= 50) && y !== ''
    },
    set_experience_years (item, event) {
      var yrs = event.target.parentElement.parentElement.getElementsByTagName('input')[0].value
      item.value = yrs
      this.valid = false
      this.valid_asign = true
      if (this.valid_years(yrs)) {
        this.valid = !this.valid
        this.valid_asign = !this.valid_asign
      }
    },
    setupLockButtonsBar () {
      var controller = new this.$scrollmagic.Controller()
      new this.$scrollmagic.Scene({ triggerElement: '#create-form-container', triggerHook: 0, offset: 0 })
      .setClassToggle('#create-buttons-bar', 'magic-scroll') // add .addIndicators() to check trigger position
      .addTo(controller)
    },
    getPosition () {
      this.errors.expiration_date_color = 'black'
      this.get_departments()
      this.get_skills()
      this.setupLockButtonsBar()
      if (this.$route.query.id !== undefined) {
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
        this.axios.get('/position/' + this.$route.query.id)
        .then((response) => {
          if (response.data.data.position.status_type !== 'unpublished') {
            this.status = 'published'
          }
          this.position = response.data.data.position
          this.id = response.data.data.position.id
          this.shareUrl = 'http://' + window.location.href.split('/')[2] + '/position-apply/' + this.id
          document.getElementById('name_label').parentElement.classList.add('is-focused')
          this.schema.name = response.data.data.position.name
          this.department = { name: response.data.data.position.department_name, id: Math.floor((Math.random() * 10000000)) }
          this.city = [response.data.data.position.city]
          this.schema.expiration_date = response.data.data.position.expiration_date.substring(0, 10)
          this.schema.description = response.data.data.position.description
          if (this.schema.description !== '') {
            this.description_empty = false
          }
          this.schema.work_team_description = response.data.data.position.work_team_description
          if (this.schema.work_team_description !== '') {
            this.work_team_description_empty = false
          }
          this.schema.candidate_characteristics = response.data.data.position.candidate_characteristics
          if (this.schema.candidate_characteristics !== '') {
            this.candidate_characteristics_empty = false
          }
          this.get_filters(this.$route.query.id)
          if (this.city[0] === '') {
            document.getElementById('cities_table').style.display = 'none'
          }
        })
        .catch(error => { console.log(error) })
      }
    }
  },
  mounted () {
    this.getPosition()
  },
  created: function () {
    this.bootstrap_min_js = document.createElement('script')
    this.bootstrap_min_js.setAttribute('src', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
    this.bootstrap_min_js.setAttribute('integrity', 'sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa')
    this.bootstrap_min_js.setAttribute('crossorigin', 'anonymous')
    document.head.appendChild(this.bootstrap_min_js)
  }
}
