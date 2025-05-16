import React from 'react'
import { Link } from 'react-router-dom';
import { Footer, FooterTitle, FooterLinkGroup, FooterLink, FooterDivider, FooterCopyright, FooterIcon } from 'flowbite-react';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs'

const FooterComponent = () => {
    return (
        <Footer container className='border border-t-8 border-teal-500 bg-white! text-black!'>
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to={'/'} className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 text-black py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg dark:text-white'>Sahand's</span>
                            Blog
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <FooterTitle title='About' />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href='https://flowbite-react.com/docs/components/footer'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    100 JS  Projects
                                </FooterLink>
                                <FooterLink
                                    href='/about'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Adam's Blog
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>

                        <div>
                            <FooterTitle title='Follow Us' />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href='https://flowbite-react.com/docs/components/footer'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    GitHub
                                </FooterLink>
                                <FooterLink
                                    href='/about'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Discord
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>

                        <div>
                            <FooterTitle title='Legal' />
                            <FooterLinkGroup col>
                                <FooterLink
                                    href='https://flowbite-react.com/docs/components/footer'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Privacy Policy
                                </FooterLink>
                                <FooterLink
                                    href='/about'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Terms &amp; Condition
                                </FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>

                <FooterDivider />

                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href='#' by="Adam's blog" year={new Date().getFullYear()} />

                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center flex-wrap">
                        <FooterIcon href='#' icon={BsFacebook} />
                        <FooterIcon href='#' icon={BsInstagram} />
                        <FooterIcon href='#' icon={BsTwitter} />
                        <FooterIcon href='#' icon={BsGithub} />
                        <FooterIcon href='#' icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent