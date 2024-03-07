document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.open-btn').addEventListener('click', function () {
      document.querySelector('.sidebar').style.left = '0';
      document.querySelector('.content').style.marginLeft = '250px';
      document.querySelector('.open-btn').style.display = 'none';
  });

  document.getElementById('close').addEventListener('click', function () {
      document.querySelector('.sidebar').style.left = '-250px';
      document.querySelector('.content').style.marginLeft = '0';
      document.querySelector('.open-btn').style.display = 'block';
  });
  
});