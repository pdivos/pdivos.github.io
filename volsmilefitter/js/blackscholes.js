//  JavaScript adopted from Bernt Arne Odegaard's Financial Numerical Recipes
//  http://finance.bi.no/~bernt/gcc_prog/algoritms/algoritms/algoritms.html
//  by Steve Derezinski, CXWeb, Inc.  http://www.cxweb.com
//  Copyright (C) 1998  Steve Derezinski, Bernt Arne Odegaard
//
//  This program is free software; you can redistribute it and/or
//  modify it under the terms of the GNU General Public License
//  as published by the Free Software Foundation.
 
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//  http://www.fsf.org/copyleft/gpl.html
 
// Dowloaded from https://gist.github.com/aasmith/524788 at 2015-12-21

function ndist(z) {
  return (1.0/(Math.sqrt(2*Math.PI)))*Math.exp(-0.5*z*z);
}
 
function normCdf(z) {
  b1 =  0.31938153;
  b2 = -0.356563782;
  b3 =  1.781477937;
  b4 = -1.821255978;
  b5 =  1.330274429;
  p  =  0.2316419;
  c2 =  0.3989423;
  a=Math.abs(z);
  if (a>6.0) {return 1.0;} 
  t = 1.0/(1.0+a*p);
  b = c2*Math.exp((-z)*(z/2.0));
  n = ((((b5*t+b4)*t+b3)*t+b2)*t+b1)*t;
  n = 1.0-b*n;
  if (z < 0.0) {n = 1.0 - n;}
  return n;
}  
 
function black_scholes(CallPut,S,K,r,v,T) {
  // CallPut = 1 for call and -1 for put
  // S = stock prics
  // K = strike price
  // r = no-risk interest rate
  // v = volitility
  // T = time to maturity
  if(Math.abs(CallPut)!=1) throw new Error("CallPut must be equat to +/- 1");
  var sqt = Math.sqrt(T);
  d1 = (Math.log(S/K) + r*T)/(v*sqt) + 0.5*(v*sqt);
  d2 = d1 - (v*sqt);
  Nd1 = CallPut*normCdf(CallPut*d1);
  Nd2 = CallPut*normCdf(CallPut*d2);
  //ert = Math.exp(-r*T);
  //nd1 = ndist(d1);
  //gamma = nd1/(S*v*sqt);
  //vega = S*sqt*nd1;
  //theta = -(S*v*nd1)/(2*sqt) - r*K*ert*Nd2;
  //rho = K*T*ert*Nd2;
  return ( S*Nd1 - K*Nd2*Math.exp(-r*T));
}
 
function black_scholes_iv(CallPut,S,X,r,t,o) { 
  // CallPut = Boolean (to calc CallPut, CallPut=True, put: CallPut=false)
  // S = stock prics, X = strike price, r = no-risk interest rate
  // t = time to maturity
  // o = option price
 
  sqt = Math.sqrt(t);
  MAX_ITER = 100;
  ACC = 0.0001;
 
  sigma = (o/S)/(0.398*sqt);
  for (i=0;i<MAX_ITER;i++) {
    price = black_scholes(CallPut,S,X,r,sigma,t);
    diff = o-price;
    if (Math.abs(diff) < ACC) return sigma;
    d1 = (Math.log(S/X) + r*t)/(sigma*sqt) + 0.5*sigma*sqt;
    vega = S*sqt*ndist(d1);
    sigma = sigma+diff/vega;
  }
  throw new Error("Error, failed to converge");
}

function testBlackSholes() {
  CallPut = 1;
  S = 100;
  K = 120;
  r = 0.02;
  v = 0.25;
  T = 1;
  C = black_scholes(CallPut,S,K,r,v,T);
  if(Math.abs(C-4.2)>0.0005) throw new Error("testBlackSholes failed: C = "+C);
  K = 150;
  r = 0.05;
  v = 0.55;
  C = black_scholes(CallPut,S,K,r,v,T);
  if(Math.abs(C-10.059)>0.0005) throw new Error("testBlackSholes failed: C = "+C);
  v = black_scholes_iv(CallPut,S,K,r,T,C)
  if(Math.abs(v - 0.55)>0.00001) throw new Error("testBlackSholes failed: v = "+v);
  console.log("testBlackSholes passed");
}
