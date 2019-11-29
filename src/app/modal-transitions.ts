import { Animation } from '@ionic/core';

export function rightEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
      .fromTo('translateX', '100%', '0');

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return Promise.resolve(baseAnimation
      .addElement(baseEl)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(400)
      .beforeAddClass('show-modal')
      .add(backdropAnimation)
      .add(wrapperAnimation));

}

export function rightLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateX', '0%', `${window.innerWidth - wrapperElRect.left}px`);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));

}

export function popEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
      .fromTo('translateY', '100%', `${window.innerHeight - 170}px`);

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return Promise.resolve(baseAnimation
      .addElement(baseEl)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(400)
      .beforeAddClass('show-modal')
      .add(backdropAnimation)
      .add(wrapperAnimation));

}

export function popLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${window.innerHeight - 170}px`, `${window.innerHeight}px`);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));

}

export function playlistEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
      .fromTo('translateY', '100%', `${window.innerHeight/2}px`);

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return Promise.resolve(baseAnimation
      .addElement(baseEl)
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(400)
      .beforeAddClass('show-modal')
      .add(backdropAnimation)
      .add(wrapperAnimation));

}

export function playlistLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${window.innerHeight/2}px`, `${window.innerHeight}px`);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(400)
    .add(backdropAnimation)
    .add(wrapperAnimation));

}