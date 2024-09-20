<script>
</script>

<template>
<div class="row justify-content-center">
    <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
            <div class="card-body">
                    <form @submit.prevent="authenticate">
                    <div class="mb-3">
                        <label for="tipoInput" class="form-label">Tipo de postagem: </label>
                        <select class="form-select form-select-sm" aria-label="Small select example" type="tipo"
                        id="tipoInput"
                        v-model="tipo"
                        required>
                        <option value="1">Nota</option>
                        <option value="2">Progresso</option>
                        </select>
                    </div>
                    <!--AQUI TEM QUE TER UM IF A DEPENDER DO TIPO-->
                    <div class="mb-3">
                        <label for="dadoInput" class="form-label"></label>
                        <input
                        type="email"
                        class="form-control"
                        id="emailInput"
                        placeholder="mail@mail.com"
                        v-model="identifier"
                        required
                        />
                        <div class="invalid-feedback">Você deve informar um email válido.</div>
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input
                        type="password"
                        class="form-control"
                        id="passwordInput"
                        v-model="password"
                        required
                        />
                        <div class="invalid-feedback">A senha é um campo obrigatório.</div>
                    </div>
                    
                    <div class="mb-3">
                        <input type="submit" class="float-end btn btn-primary" value="Enviar" />
                    </div>
                    
                    </form>

                    
                    
                    
            </div>
        </div>
    </div> 
</div>

</template>