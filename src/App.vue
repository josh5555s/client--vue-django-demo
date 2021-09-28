<template>
  <router-view></router-view>
  <router-view name="body"></router-view>
</template>

<style lang="scss">

@import "src/components/UI/_themes.scss";

* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
}

/* .edit-dark {
  background-color: goldenrod;
} */

.edit-light {
  border: 3px solid rgb(98, 50, 255);
  color: black;
}

.primary {
  background-color: forestgreen;
}

select {
  font-size: medium;
  margin: 0 6px;
  background-color: white;
  color: forestgreen;
  border-color: white;
  border-radius: 3px;
}

select:hover {
  background-color: #d4ffda;
}

</style>