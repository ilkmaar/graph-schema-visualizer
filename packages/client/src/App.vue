<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/query">Query</RouterLink>
        <RouterLink to="/data">Data</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

header {
  line-height: 1.5;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>