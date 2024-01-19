export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const back = block.querySelector('a[href="#back"]');
  back.href = params.get('back');
  const forward = block.querySelector('a[href="#redirect"]');
  forward.href = params.get('redirect');
  forward.setAttribute('target', '_blank');
}
