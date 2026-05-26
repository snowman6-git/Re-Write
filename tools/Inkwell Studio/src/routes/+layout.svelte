<script lang="ts">
    let { children } = $props(); // 스벨트 5부턴 이렇게
</script>


<div id="container">
    <nav>
        <a class="head_menu" href="/">홈</a>
        <a class="head_menu">설정</a>
    </nav>
    
    <main id="main-content">
        {@render children()}
    </main>
</div>

<style>
    nav{
        width: 100%; height: 2rem;
        box-sizing: border-box;
        display: flex;
        border-bottom: 0.2rem solid gray;
    } 
    .head_menu{
        padding: 0rem 0.5rem 0rem 0.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        text-decoration: none;
    }
    .head_menu:hover{
        background-color: gray;
    }
    #container{
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        height: 100vh;
    }
    #main-content{
        flex: 1;
    }
</style>