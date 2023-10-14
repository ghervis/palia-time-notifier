export async function populateNews() {
	const nowDate = Date.now();
	if (window.__newsFetchTimeout && window.__newsFetchTimeout > nowDate) {
		return;
	}

	window.__newsFetchTimeout = nowDate + 600000;

	let htmlResponse;
	try {
		htmlResponse = await fetch(`https://ghervis.vercel.app/api/palia-news/${Date.now()}`);
	} catch (reason) {
		console.error('Unable to fetch news.', reason);
		return;
	}

	const htmlText = await htmlResponse.text()
	
	const parser = new DOMParser()
	const virtualDoc = parser.parseFromString(htmlText, 'text/html');

	let newsContainer = document.getElementById('news-container');
	newsContainer.innerHTML = '';

	virtualDoc.querySelectorAll('aside > div > article > div:nth-child(2)').forEach((eachChild) => {
		const anchorElement = document.createElement("a");
		anchorElement.innerText = eachChild.querySelector('h3').innerText;
		anchorElement.href = `https://palia.com${eachChild.querySelector('a').getAttribute('href')}`;
		anchorElement.setAttribute('target', '_blank');
		newsContainer.append(anchorElement);
	});
}