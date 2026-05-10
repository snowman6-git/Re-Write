<script lang="ts">
	import { isModel_menu_open, selectedModel } from '../menu_store';
	import axios from 'axios';
	// 외부 라이브러리
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	import '../chat_body.css';

	// 하이라이팅 라이브러리
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import diff from 'highlight.js/lib/languages/diff';
	// hljs 사용할 언어 등록
	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('diff', diff);

	// Custom Data
	import { markdownContent } from '../../static/markdown.ts';

	// 컴포넌트
	import ModelList from '../components/ModelList.svelte';
	import { tick } from 'svelte';

	// 차차 엔브넣고 최적화 하기
	const API_URL = 'http://localhost:3000';

	interface Msg {
		from: string;
		content: string;
	}
	let user_input = $state('');
	// 상태에 인터페이스 추가로 변수들의 타입추론 지원(걍 빨간줄 지워줌 없어도 문제는 X 있음 기분좋아.)
	// let MsgBox = $state<Msg[]>([
	//     // {from: "ai", content: `${markdownContent}`}
	// ])
	let MsgBox: Msg[] = $state([]);

	interface ModelInfo {
		id: string;
		name: string;
		desc: string;
	}
	let model_list = $state<ModelInfo[]>([]);

	async function model_listup() {
		let model_list_api = await axios.get(`${API_URL}/models`);
		model_list = model_list_api.data;
		$selectedModel = model_list_api.data[0].id;
	}
	model_listup();

	let chat_body: HTMLDivElement;

	// 안봐도 나중에 최적화가 필요한 WWW
	$effect(() => {
		// messages 배열의 내용이 바뀌는 것을 Svelte가 감지합니다.
		MsgBox.map((m) => m.content);
		if (chat_body) {
			// 화면이 실제 업데이트될 때까지 아주 잠시(tick) 기다린 후 스크롤
			tick().then(() => {
				chat_body.scrollTo({
					top: chat_body.scrollHeight,
					behavior: 'smooth' // 부드럽게 스크롤 (원치 않으면 'auto')
				});
			});
		}
	});

	// 작동은 하는데 뭔지 못알아 처먹었으니 공부하기 대충 백앤드에 오쳥 때리고 응답 바디에 리더걸고 와일로 반복 수락하는거 같은데, 소켓이 더 나은건 아닌지 고민 ㄱ
	async function chat() {
		// 1. 유저 메시지 추가
		const currentInput = user_input;
		MsgBox = [...MsgBox, { from: 'user', content: currentInput }];
		user_input = '';

		// 2. AI 메시지 공간 미리 생성 (빈 내용으로 추가)
		// 이 시점에서 MsgBox의 마지막 인덱스가 AI의 메시지 위치가 됩니다.
		MsgBox = [...MsgBox, { from: 'Re:Write_AI', content: '' }];
		const aiMsgIndex = MsgBox.length - 1;

		const response = await fetch(`${API_URL}/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat: currentInput, model: $selectedModel })
		});

		const reader = response.body?.getReader();
		const decoder = new TextDecoder();

		if (!reader) return;

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value);
			const lines = chunk.split('\n');

			for (const line of lines) {
				// Open-WebUI/OpenAI 특유의 SSE 데이터 포맷 처리 [cite: 12]
				if (line.startsWith('data: ') && line !== 'data: [DONE]') {
					try {
						const jsonStr = line.slice(6);
						const data = JSON.parse(jsonStr);
						const content = data.choices[0].delta?.content || '';

						// 3. 기존 틀 유지: 특정 인덱스의 content만 누적 업데이트 [cite: 11]
						MsgBox[aiMsgIndex].content += content;

						// Svelte 반응성 트리거: 배열을 재할당해야 UI가 갱신됩니다.
						MsgBox = [...MsgBox];
					} catch (e) {
						// 불완전한 JSON 데이터가 들어올 경우 대비
						continue;
					}
				}
			}
		}
	}

	// let chat_api = await axios.post(`${API_URL}/chat`, {
	//     chat: chat,
	//     model: $selectedModel
	// }, {})

	function handleGlobalKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			chat();
		}
	}
	function open_model_menu() {
		$isModel_menu_open = !$isModel_menu_open;
	}
</script>

<!-- 줌(아줌마아님)밴 -->
<meta
	name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>

<!-- 어디든엔터라면채팅을넣어 -->
<svelte:window on:keydown={handleGlobalKeyDown} />

<div id="main">
	<div id="header">
		<!-- <div>back</div> -->
		<!-- <div>title</div> -->

		<div id="header_right">
			<div>
				{#await model_listup()}
					<button id="model_menu_btn" disabled>Loading...</button>
				{:then}
					<button id="model_menu_btn" onclick={open_model_menu}>{$selectedModel}</button>
				{/await}
				<button
					id="force_menu"
					onclick={() => ($isModel_menu_open = false)}
					class:disable={$isModel_menu_open}>a</button
				>
				{#if $isModel_menu_open}
					<ModelList {model_list} />
				{/if}
			</div>
			<!-- <button id="side_menu" onclick={alert("menu")}></button> -->
		</div>
	</div>
	<div id="chat_body" bind:this={chat_body}>
		{#each MsgBox as msg (msg.content)}
			<!-- 잠깐만 구분선용으로 쓰기 -->
			<div style="opacity: 0.5; font-size: 0.8rem; font-weight: bold;">[{msg.from}]</div>
			{@html marked(DOMPurify.sanitize(msg.content))}

			<!-- 비정제 HTML marked가 스타일링함 -->
			<!-- {marked(msg.content)} -->

			<!-- 테스트용 -->
			<!-- {msg.content} -->
			<!-- {@html msg.content} -->
		{/each}
	</div>
	<div id="chat_input">
		<input id="user_input" type="text" placeholder="텍스트 입력" bind:value={user_input} />
	</div>
</div>

<style>
	#main {
		width: 100dvw;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#force_menu {
		width: 100dvw;
		height: 100dvh;
		position: fixed;
		display: none;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
	#force_menu.disable {
		display: block;
		/* background-color: rgba(0, 0, 0, 1); */
		backdrop-filter: blur(0.2rem);
		/* opacity: 0.5; */
	}
	#header {
		width: 100dvw;
		height: 3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		/* padding-left: 0.5rem; padding-right: 0.5rem; */
		border-bottom: 0.1rem solid gray;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	#header_right {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	#side_menu {
		background-color: red;
		height: 100%;
		aspect-ratio: 1 / 1;
		background-image: url('../lib/assets/h_menu.svg');
	}

	#model_menu_btn {
		background-color: transparent;
		border: 0.2rem solid grey;
		padding: 0.25rem;
		color: white;
		font-size: 1rem;
	}

	#chat_input {
		width: 80%;
		height: 4rem;
		border: 0.2rem solid gray;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
		padding: 0.25rem 1rem 0.25rem 1rem;
		background-color: #252525;
	}
	#user_input {
		font-family: 'NxMaple';
		width: 100%;
		height: 100%;
		background-color: transparent;
		border: none;
		outline: none;
		font-size: 1.2rem;
		color: white;
	}
</style>
