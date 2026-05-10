export const markdownContent = `<h1>존재하는 모든 마크다운 표시</h1>
<p>
  <em>이탤릭체</em>와 <strong>굵은 글씨</strong>는 가장 기본적인 문법입니다. 
  <em><strong>이탤릭체와 굵은 글씨</strong></em>를 함께 사용할 수도 있습니다. 
  <del>취소선</del>도 지원합니다.
</p>

<h2>제목 (Heading)</h2>
<h1>H1: 가장 큰 제목</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
<h6>H6: 가장 작은 제목</h6>

<h2>목록 (Lists)</h2>
<h3>순서 없는 목록</h3>
<ul>
  <li>항목 1</li>
  <li>항목 2
    <ul>
      <li>하위 항목 2-1</li>
    </ul>
  </li>
</ul>

<h3>순서 있는 목록</h3>
<ol>
  <li>첫 번째</li>
  <li>두 번째
    <ol>
      <li>하위 첫 번째</li>
    </ol>
  </li>
</ol>

<h2>인용문 (Blockquotes)</h2>
<blockquote>
  <p>한 줄 인용문입니다.</p>
  <blockquote>
    <p>중첩된 인용문도 가능합니다.</p>
  </blockquote>
</blockquote>

<h2>코드 (Code)</h2>
<p>인라인 코드는 \` \`변수\` \` 형태로 표기합니다.</p>

<pre><code class="language-python">
# 코드 블록 (Python 예시)
def hello():
    print("Hello World")
</code></pre>

<pre><code class="language-javascript">
// 코드 블록 (JavaScript 예시)
console.log("Hello World");
</code></pre>

<h2>테이블 (Tables)</h2>
<table>
  <thead>
    <tr>
      <th align="left">왼쪽 정렬</th>
      <th align="center">가운데 정렬</th>
      <th align="right">오른쪽 정렬</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="left">데이터</td>
      <td align="center">데이터</td>
      <td align="right">데이터</td>
    </tr>
    <tr>
      <td align="left">데이터</td>
      <td align="center">데이터</td>
      <td align="right">데이터</td>
    </tr>
  </tbody>
</table>

<h2>링크 (Links)</h2>
<p>
  <a href="https://www.example.com">링크 텍스트</a> 
  이메일 링크: <a href="mailto:user@example.com">user@example.com</a>
</p>

<h2>이미지 (Images)</h2>
<p><img src="https://via.placeholder.com/150" alt="대체 텍스트"></p>

<h2>수식 (Math)</h2>
<p>$$ E = mc^2 $$</p>
<p>\`$E = mc^2$\`</p>

<h2>구분선 (Horizontal Rule)</h2>
<hr>

<h2>기타</h2>
<ul>
  <li><input disabled="" type="checkbox"> 완료되지 않은 체크박스</li>
  <li><input checked="" disabled="" type="checkbox"> 완료된 체크박스</li>
</ul>`;