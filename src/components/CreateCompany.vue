<template>
  <div id="general-container">
    <toolbar></toolbar>
    <!-- body-container start -->
    <div class="body-container">
      <!-- header start -->
      <div class="section-header">
        <div class="general-container">
          <div class="row">
            <div class="col-xs-12">
              <h1 class="header-title wow fadeInLeft" data-wow-delay="0.4s" data-wow-duration="1.2s">Registrar nueva empresa</h1>
            </div>
          </div>
        </div>
      </div><!-- header end -->

      <div class="general-container">

        <div class="create-form">

          <div class="row">
            <div class="col-xs-offset-3 col-xs-6">
              <div class="form-header-title">Ahora cuéntanos un poco sobre su empresa</div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-offset-3 col-xs-6">
              <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                <div class="select-label" v-bind:class="{ 'error': $v.number_employees.$error }">¿Cuantos empleados tiene su empresa? *</div>
                <select v-on:input="$v.number_employees.$touch" v-model="number_employees" id="number_employees" name="number_employees" class="mdl-selectfield__select">
                  <option value=""></option>
                  <option value="1-50">1-50</option>
                  <option value="51-150">51-150</option>
                  <option value="151-500">151-500</option>
                  <option value="Más de 500">Más de 500</option>
                </select>
                <label class="mdl-selectfield__label" for="number_employees"></label>
                <span class="mdl-textfield__error">Error message</span>
              </div>
            </div>
            <div class="col-xs-offset-3 col-xs-6">
              <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                <div class="select-label" v-bind:class="{ 'error': $v.industry.$error }">¿En que industria se desempeña su empresa?*</div>
                <select v-on:input="$v.industry.$touch" v-model="industry" id="industry" name="industry" class="mdl-selectfield__select">
                  <option value=""></option>
                  <option value="Banca o Finanzas">Banca o Finanzas</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Agricultura">Agricultura</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Importación y Exportación">Importación y Exportación</option>
                  <option value="Gobierno">Gobierno</option>
                  <option value="Otra">Otra</option>
                </select>
                <label class="mdl-selectfield__label" for="industry"></label>
                <span class="mdl-textfield__error">Error message</span>
              </div>
            </div>

            <div class="col-xs-offset-3 col-xs-6">
              <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
                <div class="select-label" v-bind:class="{ 'error': $v.company_role.$error }">¿Cuál es su rol dentro de la empresa? *</div>
                <select v-on:input="$v.company_role.$touch" v-model="company_role" id="company_role" name="company_role" class="mdl-selectfield__select">
                  <option value=""></option>
                  <option value="VP o Jefe de Recursos Humanos">VP o Jefe de Recursos Humanos</option>
                  <option value="Gerente de RRHH">Gerente de RRHH</option>
                  <option value="Coordinador de RRHH">Coordinador de RRHH</option>
                  <option value="Generalista de RRHH">Generalista de RRHH</option>
                  <option value="Especialista de RRHH">Especialista de RRHH</option>
                  <option value="Reclutador">Reclutador</option>
                  <option value="Generalista de Recursos Humanos">Generalista de Recursos Humanos</option>
                  <option value="Otro">Otro</option>
                </select>
                <label class="mdl-selectfield__label" for="company_role"></label>
                <span class="mdl-textfield__error">Error message</span>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-offset-3 col-xs-6">
              <div class="separator separator-btn-container"></div>
            </div>
          </div>

          <div>
            <div style="display: none;" class="alert alert-danger">
              <i class="glyphicon glyphicon-remove-sign"></i> <strong>Campos requeridos</strong>
              <p>Antes de continuar por favor verifique la información suministrada.</p>
            </div>
            <div style="display: none;" class="alert alert-danger">
              <i class="glyphicon glyphicon-remove-sign"></i> <strong>Oops!</strong>
              <p>Ocurrio un error inesperado, por favor contacte al administrador del sistema.</p>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-offset-4 col-xs-4">
              <div class="form-btn-container">
                <button id="save" @click="create_company('save', $v)" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent btn-confirm">Continuar</button>
              </div>
            </div>
          </div>

        </div><!-- create-form end -->
      </div><!-- create-form-container end -->


    </div><!-- body-container end -->
  </div>
</template>

<script>
  import Toolbar from './Toolbar'
  import AppNav from './AppNav'
  import { getAccessToken, getIdToken, isLoggedIn, getUserInfo } from '../../utils/auth'
  import { required } from 'vuelidate/lib/validators'

  export default {
    components: {
      AppNav,
      Toolbar
    },
    data: function () {
      return {
        number_employees: '',
        industry: '',
        company_role: '',
        name: '',
        user_id: ''
      }
    },
    validations: {
      number_employees: {
        required
      },
      industry: {
        required
      },
      company_role: {
        required
      }
    },
    methods: {
      isLoggedIn () {
        return isLoggedIn()
      },
      getUserInfo () {
        this.user_info = JSON.parse(getUserInfo())
        this.user_id = this.user_info.user_id
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
      create_company (button, v) {
        var oldMsg = document.getElementById(button).innerHTML
        document.getElementsByClassName('alert-danger')[0].style.display = 'none'
        document.getElementsByClassName('alert-danger')[1].style.display = 'none'
        v.$touch()
        if (!v.$error) {
          this.show_waiting(button, 'Guardando...')
          this.axios.defaults.headers.common['Authorization'] = `Bearer ${getIdToken()}[${getAccessToken()}`
          this.axios.post('/companies', {
            'number_employees': this.number_employees,
            'industry': this.industry
          })
          .then(response => {
            localStorage.setItem('company_id', response.data.data.company_id)
            this.axios.post('/users', {
              'company_role': this.company_role,
              'company_id': response.data.data.company_id,
              'user_id': this.user_id
            })
            .then(response => {
              window.location.href = '/company-jobs'
              this.restoreButton(button, oldMsg)
            })
            .catch(error => {
              console.log(error)
              document.getElementsByClassName('alert-danger')[1].style.display = 'block'
              this.restoreButton(button, oldMsg)
            })
          })
          .catch(error => {
            console.log(error)
            document.getElementsByClassName('alert-danger')[1].style.display = 'block'
            this.restoreButton(button, oldMsg)
          })
        } else {
          document.getElementsByClassName('alert-danger')[0].style.display = 'block'
          this.restoreButton(button, oldMsg)
        }
      }
    },
    beforeCreate () {
      if (localStorage['company_id'] !== undefined) {
        window.location.href = '/positions'
      }
    },
    mounted: function () {
      this.getUserInfo()
      this.bootstrap_min_js = document.createElement('script')
      this.bootstrap_min_js.setAttribute('src', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
      this.bootstrap_min_js.setAttribute('integrity', 'sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa')
      this.bootstrap_min_js.setAttribute('crossorigin', 'anonymous')
      document.head.appendChild(this.bootstrap_min_js)
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
  .select-label{
    color: #12abd4;
  }
  .error{
    color: 	#FF0000;
  }
  #container-positions{
    width: 40%;
    margin: 0 auto;
  }
  #add-section{
    text-align: right;
    width: 100%;
    padding: 1em 1em 1em 1em;
  }
  .required-span{
    color: #a94442;
  }
</style>
