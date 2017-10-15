# maximumentropyvolsmilefitter.github.io

Solves:

Int f(x) ln f(x) dx -> max

s.t.:

Int f(x) U_i(x) dx = C_i

where:

U_0(x) = 1, C_0 = 1

U_1(x) = e^x, C_1 = 1

U_j(x) = max0(S_0 e^x - K_j)
