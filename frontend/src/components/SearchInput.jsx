import React from 'react';
import styled from 'styled-components';

const SearchInput = ({ placeholder = "Search habits, analytics...", value, onChange }) => {
  return (
    <StyledWrapper>
      <div id="poda">
        <div className="glow" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="white" />
        <div className="border" />
        <div id="main">
          <input 
            placeholder={placeholder} 
            type="text" 
            name="text" 
            className="input" 
            value={value}
            onChange={onChange}
          />
          <div id="input-mask" />
          <div id="pink-mask" />
          <div className="filterBorder" />
          <div id="filter-icon">
            <svg preserveAspectRatio="none" height={20} width={20} viewBox="4.8 4.56 14.832 15.408" fill="none">
              <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth={1} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div id="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={18} fill="none" className="feather feather-search">
              <circle stroke="url(#search)" r={8} cy={11} cx={11} />
              <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#f8e7f8" offset="0%" />
                  <stop stopColor="#b6a9b7" offset="50%" />
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#b6a9b7" offset="0%" />
                  <stop stopColor="#837484" offset="50%" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Desktop and tablet styles */
  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 48px;
    max-width: 100%;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    border-radius: 8px;
    filter: blur(2px);
  }
  
  .input {
    background-color: #FFFFFF;
    border: none;
    width: 100%;
    height: 40px;
    border-radius: 6px;
    color: #334155;
    padding-inline: 45px;
    font-size: 14px;
  }
  
  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
  }
  
  .input::placeholder {
    color: #94A3B8;
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 80px;
    height: 16px;
    position: absolute;
    background: linear-gradient(90deg, transparent, white);
    top: 12px;
    left: 55px;
  }
  
  #pink-mask {
    pointer-events: none;
    width: 24px;
    height: 16px;
    position: absolute;
    background: #cf30aa;
    top: 8px;
    left: 4px;
    filter: blur(16px);
    opacity: 0.8;
    transition: all 2s;
  }
  
  #main:hover > #pink-mask {
    opacity: 0;
  }

  .white {
    max-height: 44px;
    max-width: 100%;
    border-radius: 6px;
    filter: blur(1.5px);
  }

  .white::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 400px;
    height: 400px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #a099d8,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #dfa2da,
      rgba(0, 0, 0, 0) 58%
    );
    transition: all 2s;
  }
  
  .border {
    max-height: 42px;
    max-width: 100%;
    border-radius: 7px;
    filter: blur(0.4px);
  }
  
  .border::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 400px;
    height: 400px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #FFFFFF,
      #402fb5 5%,
      #FFFFFF 14%,
      #FFFFFF 50%,
      #cf30aa 60%,
      #FFFFFF 64%
    );
    transition: all 2s;
  }
  
  .darkBorderBg {
    max-height: 46px;
    max-width: 100%;
  }
  
  .darkBorderBg::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 400px;
    height: 400px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #18116a,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #6e1b60,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }
  
  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(262deg);
  }
  
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
  }
  
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(263deg);
  }
  
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(250deg);
  }

  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 4s;
  }
  
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 4s;
  }
  
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 4s;
  }
  
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 4s;
  }

  .glow {
    overflow: hidden;
    filter: blur(24px);
    opacity: 0.4;
    max-height: 80px;
    max-width: 100%;
  }
  
  .glow:before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #FFFFFF,
      #402fb5 5%,
      #FFFFFF 38%,
      #FFFFFF 50%,
      #cf30aa 60%,
      #FFFFFF 87%
    );
    transition: all 2s;
  }

  #filter-icon {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 30px;
    max-width: 30px;
    height: 100%;
    width: 100%;
    isolation: isolate;
    overflow: hidden;
    border-radius: 6px;
    background: linear-gradient(180deg, #f8f9fa, #e9ecef, #f8f9fa);
    border: 1px solid transparent;
  }
  
  .filterBorder {
    height: 32px;
    width: 32px;
    position: absolute;
    overflow: hidden;
    top: 5px;
    right: 5px;
    border-radius: 6px;
  }

  .filterBorder::before {
    content: "";
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 400px;
    height: 400px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #3d3a4f,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #3d3a4f,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }
  
  #main {
    position: relative;
    width: 100%;
  }
  
  #search-icon {
    position: absolute;
    left: 15px;
    top: 11px;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .input {
      height: 36px;
      padding-inline: 40px;
      font-size: 13px;
    }
    
    .white, .border, .darkBorderBg {
      max-height: 42px;
    }
    
    .white {
      max-height: 38px;
    }
    
    .border {
      max-height: 36px;
    }
    
    .darkBorderBg {
      max-height: 40px;
    }
    
    .glow {
      max-height: 60px;
    }
    
    #input-mask {
      width: 60px;
      height: 14px;
      top: 11px;
      left: 45px;
    }
    
    #pink-mask {
      width: 20px;
      height: 14px;
      top: 7px;
      left: 3px;
      filter: blur(12px);
    }
    
    #filter-icon {
      max-height: 26px;
      max-width: 26px;
      top: 5px;
      right: 5px;
    }
    
    .filterBorder {
      height: 28px;
      width: 28px;
      top: 4px;
      right: 4px;
    }
    
    #search-icon {
      left: 12px;
      top: 9px;
    }
  }

  @media (max-width: 480px) {
    .input {
      height: 32px;
      padding-inline: 35px;
      font-size: 12px;
    }
    
    .white, .border, .darkBorderBg {
      max-height: 38px;
    }
    
    .white {
      max-height: 34px;
    }
    
    .border {
      max-height: 32px;
    }
    
    .darkBorderBg {
      max-height: 36px;
    }
    
    .glow {
      max-height: 50px;
      filter: blur(18px);
    }
    
    #input-mask {
      width: 50px;
      height: 12px;
      top: 10px;
      left: 40px;
    }
    
    #pink-mask {
      width: 16px;
      height: 12px;
      top: 6px;
      left: 2px;
      filter: blur(10px);
    }
    
    #filter-icon {
      max-height: 22px;
      max-width: 22px;
      top: 4px;
      right: 4px;
    }
    
    .filterBorder {
      height: 24px;
      width: 24px;
      top: 3px;
      right: 3px;
    }
    
    #search-icon {
      left: 10px;
      top: 8px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  @media (max-width: 320px) {
    .input {
      height: 28px;
      padding-inline: 30px;
      font-size: 11px;
    }
    
    .white, .border, .darkBorderBg {
      max-height: 32px;
    }
    
    .white {
      max-height: 28px;
    }
    
    .border {
      max-height: 26px;
    }
    
    .darkBorderBg {
      max-height: 30px;
    }
    
    .glow {
      max-height: 40px;
      filter: blur(15px);
    }
    
    #input-mask {
      width: 40px;
      height: 10px;
      top: 9px;
      left: 35px;
    }
    
    #pink-mask {
      width: 12px;
      height: 10px;
      top: 5px;
      left: 1px;
      filter: blur(8px);
    }
    
    #filter-icon {
      max-height: 18px;
      max-width: 18px;
      top: 3px;
      right: 3px;
    }
    
    .filterBorder {
      height: 20px;
      width: 20px;
      top: 2px;
      right: 2px;
    }
    
    #search-icon {
      left: 8px;
      top: 7px;
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
`;

export default SearchInput;