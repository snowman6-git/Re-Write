<script lang="ts">
    let { children } = $props(); // 스벨트 5부턴 이렇게
</script>


<div id="main">
    <nav>
        <a class="head_menu">프로젝트</a>
        <a class="head_menu">설정</a>
    </nav>
    <div id="view">
        {@render children()}
    </div>
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
    }
    .head_menu:hover{
        background-color: gray;
    }

    #main, #view{ width: 100dvw; height: 100dvh; }
    #main{
        display: flex;
        flex-direction: column;
        align-items: center; justify-content: center;
    }
    #view{
    }
</style>