<template>
  <div
    class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 dark:bg-[#181c24] overflow-hidden font-sans relative transition-colors duration-300"
  >
    <button
      type="button"
      class="absolute right-6 top-5 z-30 p-0 border-0 bg-transparent shadow-none appearance-none"
    >
      <el-tooltip
        class=""
        effect="dark"
        :content="appStore.isDark ? '切换为浅色' : '切换为深色'"
        placement="bottom"
      >
        <el-icon
          v-if="appStore.isDark"
          class="w-8 h-8 shadow rounded-full border border-gray-600 cursor-pointer border-solid"
          @click="appStore.toggleTheme(false)"
        >
          <Sunny />
        </el-icon>
        <el-icon
          v-else
          class="w-8 h-8 shadow rounded-full border border-gray-200 cursor-pointer border-solid"
          @click="appStore.toggleTheme(true)"
        >
          <Moon />
        </el-icon>
      </el-tooltip>
    </button>

    <div class="absolute left-4 top-4 z-20 flex items-center">
      <img :src="setting.appLogo" :alt="setting.appName" class="w-20 h-16" />
      <p
        class="text-lg font-semibold text-blue-600 dark:text-blue-400 tracking-wide"
      >
        {{ setting.appName }}
      </p>
    </div>
    <div
      class="relative flex-1 md:basis-3/5 min-h-[200px] flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 z-0 bg-gradient-to-br from-pink-100 via-blue-100 to-white dark:from-[#222735] dark:via-[#1a233a] dark:to-[#232b3f] transition-colors duration-300"
      ></div>
      <div
        class="absolute inset-0 z-10 bg-white/60 backdrop-blur-lg dark:bg-[#232b3f]/60 dark:backdrop-blur-xl transition-colors duration-300"
      ></div>
      <div
        class="absolute inset-0 z-20 bg-gradient-to-tr from-blue-200/40 via-transparent to-pink-200/30 blur-3xl dark:from-blue-900/30 dark:to-purple-800/40 transition-colors duration-300"
      ></div>
      <div
        class="relative z-30 flex items-center justify-center w-40 h-40 md:w-64 md:h-64 animate-float mb-8"
      >
        <img
          src="/cover.jpg"
          :alt="setting.appName"
          class="w-full h-full drop-shadow-lg rounded-full"
        />
      </div>
      <div class="z-30 text-center px-2">
        <span
          class="text-xl md:text-2xl font-bold block tracking-wide text-blue-600 dark:text-blue-400"
          >开箱即用的企业级中后台管理系统</span
        >
        <p
          class="mt-2 text-gray-500 dark:text-gray-300 text-sm md:text-base tracking-wide"
        >
          简单易用 架构清晰 开箱即用
        </p>
      </div>
    </div>
    <div
      class="relative flex-1 md:basis-2/5 min-h-[300px] bg-white dark:bg-[#232b3f] flex flex-col items-center justify-center z-10 transition-colors duration-300"
    >
      <div class="mb-8 w-full max-w-[360px]">
        <p
          class="text-center text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100"
        >
          欢迎回来 👋🏻
        </p>
        <p
          class="text-center text-xs md:text-sm text-gray-500 dark:text-gray-300 mt-2.5"
        >
          请输入您的帐户信息以开始管理您的项目
        </p>
      </div>
      <el-form
        ref="loginForm"
        class="w-full max-w-[360px]"
        :model="loginFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        @keyup.enter="submitForm"
      >
        <el-form-item prop="userName" class="mb-6">
          <el-input
            v-model="loginFormData.userName"
            size="large"
            placeholder="请输入用户名"
            suffix-icon="user"
          />
        </el-form-item>
        <el-form-item prop="password" class="mb-6">
          <el-input
            v-model="loginFormData.password"
            show-password
            size="large"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          v-if="loginFormData.showCaptcha"
          prop="captcha"
          class="mb-6"
        >
          <div class="flex w-full justify-between">
            <el-input
              v-model="loginFormData.captcha"
              placeholder="请输入验证码"
              size="large"
              class="flex-1 mr-5"
            />
            <div
              class="w-1/3 h-11 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center"
            >
              <img
                v-if="picPath"
                class="w-full h-full"
                :src="picPath"
                alt="请输入验证码"
                @click="loginVerify()"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item class="mb-6">
          <el-button
            class="shadow h-11 w-full"
            type="primary"
            size="large"
            :loading="loading"
            :disabled="loading"
            @click="submitForm"
          >
            <span>登 录</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="w-full absolute left-0 right-0 bottom-3 mx-auto z-20">
        <BottomInfo>
          <div class="hidden md:flex items-center justify-center gap-2">
            <a href="https://www.apevolo.com/" target="_blank">
              <img src="@/assets/docs.png" class="w-8 h-8" alt="官网文档" />
            </a>
            <a :href="setting.githubUrl" target="_blank">
              <img src="@/assets/github.png" class="w-8 h-8" alt="github" />
            </a>
          </div>
        </BottomInfo>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getLoginCaptcha } from '@/api/verificationCode'
  import BottomInfo from '@/components/BottomInfo/index.vue'
  import { reactive, ref } from 'vue'
  import { ElMessage, type FormInstance } from 'element-plus'
  import { useAppStore } from '@/pinia'
  import { useUserStore } from '@/pinia/modules/user'
  import setting from '@/setting'

  defineOptions({
    name: 'Login'
  })
  const appStore = useAppStore()

  const loginVerify = async () => {
    const res = await getLoginCaptcha()
    picPath.value = res.data.img
    loginFormData.captchaId = res.data.captchaId
    loginFormData.showCaptcha = res.data.showCaptcha
  }
  const loginForm = ref<FormInstance | null>(null)
  const picPath = ref('')
  const loading = ref(false)
  const loginFormData = reactive({
    userName: 'apevolo',
    password: '',
    captcha: '',
    captchaId: '',
    showCaptcha: false
  })
  const userStore = useUserStore()
  const login = async () => {
    return await userStore.LoginIn(
      loginFormData.userName,
      loginFormData.password,
      loginFormData.captcha,
      loginFormData.captchaId
    )
  }
  const submitForm = () => {
    loginForm.value?.validate(async (v: boolean) => {
      if (!v) {
        ElMessage({
          type: 'error',
          message: '请完善所有登录信息后再提交',
          showClose: true
        })
        await loginVerify()
        return
      }
      const flag = await login()
      if (!flag) {
        await loginVerify()
      }
    })
  }
  const rules = reactive({
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  })
  loginVerify()
</script>

<style scoped>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-18px);
    }
  }
  .animate-float {
    animation: float 3.6s ease-in-out infinite;
  }
</style>
